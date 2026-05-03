const express = require("express");
const fs = require("fs");
const fsPromises = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const { body, validationResult } = require("express-validator");
const Course = require("../models/Course");
const Resource = require("../models/Resource");
const { attachOptionalViewer } = require("../middleware/optionalViewer");
const { courseSchoolMatchesViewer } = require("../lib/schoolScope");
const { extensionAllowed, MAX_FILE_BYTES } = require("../lib/resourceUploadLimits");

const router = express.Router();

const uploadsAbsDir = path.join(__dirname, "..", "uploads", "resources");
fs.mkdirSync(uploadsAbsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsAbsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const name = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_BYTES },
});

const assertValid = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  return next();
};

function handleUpload(req, res, next) {
  upload.single("file")(req, res, (err) => {
    if (!err) return next();
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ error: "File too large (max 100 MB)." });
    }
    return res.status(400).json({ error: err.message || "Upload failed." });
  });
}

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
  handleUpload,
  [
    body("title").trim().notEmpty().withMessage("title is required"),
    body("courseId").isMongoId().withMessage("courseId must be a valid id"),
    body("category")
      .isIn(["notes", "flashcards", "videos", "practice"])
      .withMessage("category has to be notes, flashcards, videos, or practice"),
    body("uploadedBy").optional().trim(),
  ],
  assertValid,
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "file is required" });
    }

    const { title, courseId, category, uploadedBy } = req.body;

    if (!extensionAllowed(category, req.file.path, req.file.originalname || req.file.filename)) {
      await fsPromises.unlink(req.file.path).catch(() => {});
      return res.status(400).json({
        error: `File type not allowed for ${category}. Upload an appropriate file for this resource type.`,
      });
    }

    const courseExists = await Course.findById(courseId);
    if (!courseExists) {
      await fsPromises.unlink(req.file.path).catch(() => {});
      return res.status(404).json({ error: "Course not found, cant upload to a course that doesnt exist" });
    }

    const relPath = `/uploads/resources/${req.file.filename}`;

    const created = await Resource.create({
      title,
      course: courseId,
      category,
      fileName: relPath,
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
