const express = require("express");
const { body, param, validationResult } = require("express-validator");
const multer = require("multer");
const path = require("path");
const Course = require("../models/Course");
const Resource = require("../models/Resource");
const SavedCourse = require("../models/SavedCourse");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Setup multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/course-images/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "course-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only images are allowed (jpeg, jpg, png, gif)"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

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
  description: c.description,
  school: c.school,
  imageFileName: c.imageFileName,
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
  fileUrl: r.fileName ? `http://localhost:5001/uploads/resources/${r.fileName}` : null,
  uploadedBy: r.uploadedBy,
  uploadedAt: r.uploadedAt.toISOString(),
  verified: r.verified,
});

// GET /api/courses/all - list all courses (any status) for dropdowns
router.get("/all", async (_req, res) => {
  try {
    const courses = await Course.find().select("_id name code").lean();
    return res.json(courses.map((c) => ({ id: c._id.toString(), name: c.name, code: c.code })));
  } catch (err) {
    return res.status(500).json({ error: "Could not load courses" });
  }
});

// POST /api/courses/create - make a new course with image upload
router.post(
  "/create",
  upload.single("image"),
  [
    body("name").trim().notEmpty().withMessage("Course name is required"),
    body("code").trim().notEmpty().withMessage("Course code is required"),
    body("description").optional().trim(),
    body("school").optional().trim(),
    body("duration").optional().trim(),
    body("level").optional().trim(),
  ],
  assertValid,
  async (req, res) => {
    const { name, code, description, school, duration, level } = req.body;

    try {
      const course = await Course.create({
        name,
        code,
        description: description || "",
        school: school || "—",
        imageFileName: req.file ? req.file.filename : null,
        duration: duration || "",
        level: level || "",
        status: "pending",
      });

      return res.status(201).json({
        message: "Course created successfully",
        course: courseToJson(course),
      });
    } catch (err) {
      console.error("Course creation error:", err);
      if (err.code === 11000) {
        return res.status(409).json({ error: "A course with this code already exists" });
      }
      return res.status(500).json({ error: "Could not create course", detail: err.message });
    }
  }
);

// GET /api/courses/:id - fetch a single course by ID
router.get(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid course id")],
  assertValid,
  async (req, res) => {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    return res.json(courseToJson(course));
  }
);

// POST /api/courses/:id/save - save a course for the logged-in user
router.post(
  "/:id/save",
  protect,
  [param("id").isMongoId().withMessage("Invalid course id")],
  assertValid,
  async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);

      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      const savedCourse = await SavedCourse.create({
        userId: req.user.id,
        courseId: req.params.id,
      });

      return res.status(201).json({
        message: "Course saved successfully",
        savedCourse,
      });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({ error: "Course already saved" });
      }

      return res.status(500).json({
        error: "Could not save course",
        detail: err.message,
      });
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

    const courseRes = await Resource.find({ course: courseId, verified: true });
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