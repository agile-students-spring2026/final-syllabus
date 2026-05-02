const express = require("express");
const { body, validationResult } = require("express-validator");
const Course = require("../models/Course");
const Resource = require("../models/Resource");
const { protect } = require("../middleware/authMiddleware");

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

// POST /api/resources/upload - upload a new resource to a course
router.post(
  "/upload",
  protect,
  [
    body("title").trim().notEmpty().withMessage("title is required"),
    body("courseId").isMongoId().withMessage("courseId must be a valid id"),
    body("category")
      .isIn(["notes", "flashcards", "videos", "practice"])
      .withMessage("category has to be notes, flashcards, videos, or practice"),
    body("fileName").trim().notEmpty().withMessage("fileName is required"),
  ],
  assertValid,
  async (req, res) => {
    const { title, courseId, category, fileName } = req.body;

    const courseExists = await Course.findById(courseId);
    if (!courseExists) {
      return res.status(404).json({ error: "Course not found, cant upload to a course that doesnt exist" });
    }

    const created = await Resource.create({
      title,
      course: courseId,
      category,
      fileName,
      uploadedBy: req.user.id,
    });

    return res.status(201).json({
      message: "Resource uploaded",
      resource: resourceToJson(created),
    });
  }
);

// GET /api/resources/history - get uploads by the logged-in user
router.get("/history", protect, async (req, res) => {
  const sorted = await Resource.find({ uploadedBy: req.user.id })
    .sort({ uploadedAt: -1 })
    .populate("course", "name code");
  return res.status(200).json({
    message: "Upload history",
    total: sorted.length,
    resources: sorted.map((r) => {
      const base = resourceToJson(r);
      const c = r.course;
      return { ...base, courseLabel: c && c.code ? c.code : c && c.name ? c.name : "—" };
    }),
  });
});

// GET /api/resources/all - all resources in the system with verification status (for verification page)
router.get("/all", protect, async (req, res) => {
  const sorted = await Resource.find()
    .sort({ uploadedAt: -1 })
    .populate("course", "name code");
  return res.status(200).json({
    message: "All resources",
    total: sorted.length,
    resources: sorted.map((r) => {
      const base = resourceToJson(r);
      const c = r.course;
      return { ...base, courseLabel: c && c.code ? c.code : c && c.name ? c.name : "—" };
    }),
  });
});

// GET /api/resources/verification - check whats verified and whats not
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
