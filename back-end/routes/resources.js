const express = require("express");
const { body, validationResult } = require("express-validator");
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

function courseIdString(r) {
  const ref = r.course;
  if (!ref) return "";
  const id = ref._id != null ? ref._id : ref;
  return id.toString();
}

const resourceToJson = (r) => ({
  id: r._id.toString(),
  title: r.title,
  courseId: courseIdString(r),
  category: r.category,
  fileName: r.fileName,
  uploadedBy: r.uploadedBy,
  uploadedAt: r.uploadedAt.toISOString(),
  verified: r.verified,
});

router.post(
  "/upload",
  [
    body("title").trim().notEmpty().withMessage("title is required"),
    body("courseId").isMongoId().withMessage("courseId must be a valid id"),
    body("category")
      .isIn(["notes", "flashcards", "videos", "practice"])
      .withMessage("category has to be notes, flashcards, videos, or practice"),
    body("fileName").trim().notEmpty().withMessage("fileName is required"),
    body("uploadedBy").optional().trim(),
  ],
  assertValid,
  async (req, res) => {
    const { title, courseId, category, fileName, uploadedBy } = req.body;

    const courseExists = await Course.findById(courseId);
    if (!courseExists) {
      return res.status(404).json({ error: "Course not found, cant upload to a course that doesnt exist" });
    }

    const created = await Resource.create({
      title,
      course: courseId,
      category,
      fileName,
      uploadedBy: uploadedBy || "anonymous",
    });

    return res.status(201).json({
      message: "Resource uploaded",
      resource: resourceToJson(created),
    });
  }
);

router.get("/history", attachOptionalViewer, async (req, res) => {
  const sorted = await Resource.find()
    .sort({ uploadedAt: -1 })
    .populate("course", "name code school");

  let rows = sorted;
  if (req.authUserId) {
    if (!req.viewerSchool) {
      return res.status(200).json({
        message: "Upload history",
        total: 0,
        resources: [],
      });
    }
    rows = sorted.filter((r) =>
      r.course && courseSchoolMatchesViewer(r.course.school || "", req.viewerSchool)
    );
  }

  return res.status(200).json({
    message: "Upload history",
    total: rows.length,
    resources: rows.map((r) => {
      const base = resourceToJson(r);
      const c = r.course;
      return {
        ...base,
        courseLabel: c && c.code ? c.code : c && c.name ? c.name : "—",
      };
    }),
  });
});

router.get("/verification", async (req, res) => {
  const all = await Resource.find();
  const verifyList = all.map((r) => {
    const j = resourceToJson(r);
    return {
      id: j.id,
      title: j.title,
      courseId: j.courseId,
      category: j.category,
      verified: j.verified,
      uploadedBy: j.uploadedBy,
      uploadedAt: j.uploadedAt,
    };
  });

  const verifiedCount = all.filter((r) => r.verified).length;
  const unverifiedCount = all.length - verifiedCount;

  return res.status(200).json({
    message: "Resource verification status",
    verified: verifiedCount,
    unverified: unverifiedCount,
    resources: verifyList,
  });
});

module.exports = router;
