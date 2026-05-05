const express = require("express");
const { body, param, validationResult } = require("express-validator");
const Course = require("../models/Course");
const Resource = require("../models/Resource");

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

// POST /api/courses/create - make a new course
router.post(
  "/create",
  [
    body("name").trim().notEmpty().withMessage("Course name is required"),
    body("code").trim().notEmpty().withMessage("Course code is required"),
    body("instructor").optional().trim(),
    body("description").optional().trim(),
    body("category").optional().trim(),
    body("school").optional().trim(),
    body("duration").optional().trim(),
    body("level").optional().trim(),
  ],
  assertValid,
  async (req, res) => {
    const { name, code, instructor, description, category, school, duration, level } = req.body;

    try {
      const course = await Course.create({
        name,
        code,
        instructor: instructor || "TBD",
        description: description || "",
        category: category || "General",
        school: school || "—",
        duration: duration || "",
        level: level || "",
        status: "pending",
      });

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

// GET /api/courses/:id/resources - all resources grouped by category
router.get(
  "/:id/resources",
  [param("id").isMongoId().withMessage("Invalid course id")],
  assertValid,
  async (req, res) => {
    const { id: courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
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

// GET /api/courses/:id/resources/:type - filter by specific type
router.get(
  "/:id/resources/:type",
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
