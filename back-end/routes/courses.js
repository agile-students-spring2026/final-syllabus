const express = require("express");
const { body, param, validationResult } = require("express-validator");
const Course = require("../models/Course");
const Resource = require("../models/Resource");
const { attachOptionalViewer } = require("../middleware/optionalViewer");
const { courseSchoolMatchesViewer } = require("../lib/schoolScope");

const router = express.Router();

const assertValid = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  return next();
};

const courseToJson = (c) => ({
  id: c._id.toString(),
  name: c.name,
  code: c.code,
  instructor: c.instructor,
  description: c.description,
  category: c.category,
  school: c.school,
  coverImageUrl: c.coverImageUrl || "",
  duration: c.duration,
  level: c.level,
  status: c.status,
  createdAt: c.createdAt.toISOString(),
});

const resourceToJson = (r) => ({
  id: r._id.toString(),
  title: r.title,
  courseId: r.course.toString(),
  category: r.category,
  fileName: r.fileName,
  uploadedBy: r.uploadedBy,
  uploadedAt: r.uploadedAt.toISOString(),
  verified: r.verified,
});

router.post(
  "/create",
  [
    body("name").trim().notEmpty().withMessage("Course name is required"),
    body("code").trim().notEmpty().withMessage("Course code is required"),
    body("instructor").optional().trim(),
    body("description").trim().notEmpty().withMessage("Course description is required"),
    body("category").trim().notEmpty().withMessage("Course category is required"),
    body("school").optional().trim(),
    body("duration").optional().trim(),
    body("level").optional().trim(),
    body("coverImageUrl")
      .optional({ checkFalsy: true })
      .trim()
      .custom((value) => {
        if (!value) return true;
        const dataPrefixes = ["data:image/jpeg", "data:image/png", "data:image/webp", "data:image/gif"];
        const isData = dataPrefixes.some((p) => value.startsWith(`${p};base64,`));
        if (isData) {
          if (value.length > 550_000) {
            throw new Error("Uploaded image is too large.");
          }
          return true;
        }
        try {
          const u = new URL(value);
          if (u.protocol !== "http:" && u.protocol !== "https:") {
            throw new Error();
          }
          return true;
        } catch {
          throw new Error("Cover image must be a valid URL or a small uploaded image");
        }
      }),
  ],
  assertValid,
  async (req, res) => {
    const { name, code, instructor, description, category, school, duration, level, coverImageUrl } = req.body;

    const VALID_LEVELS = ["Beginner", "Intermediate", "Advanced"];
    const levelTrimmed = typeof level === "string" ? level.trim() : "";
    const coverTrimmed = typeof coverImageUrl === "string" ? coverImageUrl.trim() : "";
    const doc = {
      name,
      code,
      instructor: instructor || "TBD",
      description: description || "",
      category,
      school: school || "—",
      duration: duration || "",
      status: "pending",
      ...(coverTrimmed ? { coverImageUrl: coverTrimmed } : {}),
    };
    if (levelTrimmed && VALID_LEVELS.includes(levelTrimmed)) {
      doc.level = levelTrimmed;
    }

    try {
      const course = await Course.create(doc);

      return res.status(201).json({
        message: "Course created successfully",
        course: courseToJson(course),
      });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({ error: "A course with this code already exists" });
      }
      return res.status(500).json({ error: "Could not create course" });
    }
  }
);

router.get(
  "/:id/resources",
  attachOptionalViewer,
  [param("id").isMongoId().withMessage("Invalid course id")],
  assertValid,
  async (req, res) => {
    const { id: courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    if (req.authUserId) {
      if (!req.viewerSchool) {
        return res.status(403).json({ error: "Add your school in your profile to view resources." });
      }
      if (!courseSchoolMatchesViewer(course.school, req.viewerSchool)) {
        return res.status(404).json({ error: "Course not found" });
      }
    }

    const courseRes = await Resource.find({ course: courseId });
    const grouped = {};
    courseRes.forEach((item) => {
      const r = resourceToJson(item);
      if (!grouped[r.category]) {
        grouped[r.category] = [];
      }
      grouped[r.category].push(r);
    });

    return res.status(200).json({
      message: "Resources retrieved",
      courseId,
      courseName: course.name,
      resources: grouped,
    });
  }
);

router.get(
  "/:id/resources/:type",
  attachOptionalViewer,
  [
    param("id").isMongoId().withMessage("Invalid course id"),
    param("type")
      .isIn(["notes", "flashcards", "videos", "practice"])
      .withMessage("Invalid type. Use notes, flashcards, videos, or practice"),
  ],
  assertValid,
  async (req, res) => {
    const { id: courseId, type: resType } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    if (req.authUserId) {
      if (!req.viewerSchool) {
        return res.status(403).json({ error: "Add your school in your profile to view resources." });
      }
      if (!courseSchoolMatchesViewer(course.school, req.viewerSchool)) {
        return res.status(404).json({ error: "Course not found" });
      }
    }

    const list = await Resource.find({ course: courseId, category: resType });
    return res.status(200).json({
      message: `${resType} for ${course.name}`,
      courseId,
      type: resType,
      resources: list.map(resourceToJson),
    });
  }
);

module.exports = router;
