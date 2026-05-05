const express = require("express");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const path = require("path");
const Course = require("../models/Course");
const Resource = require("../models/Resource");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const PUBLIC_BASE_URL = (
  process.env.PUBLIC_BASE_URL || "http://localhost:5001"
).replace(/\/$/, "");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/resources/"),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "resource-" + unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

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
  fileUrl: r.fileName
    ? `${PUBLIC_BASE_URL}/uploads/resources/${r.fileName}`
    : null,
  uploadedBy: r.uploadedBy,
  uploadedAt: r.uploadedAt.toISOString(),
  verified: r.verified,
});

// POST /api/resources/upload - upload a new resource file to a course
router.post(
  "/upload",
  protect,
  upload.single("file"),
  [
    body("title").trim().notEmpty().withMessage("title is required"),
    body("courseId").isMongoId().withMessage("courseId must be a valid id"),
    body("category")
      .isIn(["notes", "flashcards", "past-questions", "videos", "practice"])
      .withMessage(
        "category must be notes, flashcards, past-questions, videos, or practice"
      ),
  ],
  assertValid,
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "A file is required" });
    }

    const { title, courseId, category } = req.body;

    const courseExists = await Course.findById(courseId);
    if (!courseExists) {
      return res.status(404).json({ error: "Course not found" });
    }

    const created = await Resource.create({
      title,
      course: courseId,
      category,
      fileName: req.file.filename,
      uploadedBy: req.user.id,
    });

    return res.status(201).json({
      message: "Resource uploaded and pending review",
      resource: resourceToJson(created),
    });
  }
);

// GET /api/resources/history - uploads by the logged-in user
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
      return {
        ...base,
        courseLabel:
          c && c.code ? c.code : c && c.name ? c.name : "—",
      };
    }),
  });
});

// GET /api/resources/all - all resources with verification status
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
      return {
        ...base,
        courseLabel:
          c && c.code ? c.code : c && c.name ? c.name : "—",
      };
    }),
  });
});

// GET /api/resources/verification - verification counts
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