const express = require("express");
const { courses, resources } = require("../data/store.js");

const router = express.Router();

// POST /api/courses/create - make a new course
router.post("/create", (req, res) => {
  const { name, code, instructor } = req.body;

  if (!name || !code) {
    return res.status(400).json({ error: "Course name and code are required" });
  }

  // check if theres already a course w this code
  const alreadyExists = courses.find((c) => c.code === code);
  if (alreadyExists) {
    return res.status(409).json({ error: "A course with this code already exists" });
  }

  const courseObj = {
    id: `course-${Date.now()}`,
    name,
    code,
    instructor: instructor || "TBD",
    createdAt: new Date().toISOString(),
  };
  courses.push(courseObj);

  return res.status(201).json({
    message: "Course created successfully",
    course: courseObj,
  });
});

// GET /api/courses/:id/resources - all resources grouped by category
router.get("/:id/resources", (req, res) => {
  const courseId = req.params.id;

  const course = courses.find((c) => c.id === courseId);
  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }

  // get all the resources for this course
  const courseRes = resources.filter((r) => r.courseId === courseId);

  // group em by category
  const grouped = {};
  courseRes.forEach((item) => {
    if (!grouped[item.category]) {
      grouped[item.category] = [];
    }
    grouped[item.category].push(item);
  });

  return res.status(200).json({
    message: "Resources retrieved",
    courseId,
    courseName: course.name,
    resources: grouped,
  });
});

// GET /api/courses/:id/resources/:type - filter by specific type
router.get("/:id/resources/:type", (req, res) => {
  const courseId = req.params.id;
  const resType = req.params.type;

  const validTypes = ["notes", "flashcards", "videos", "practice"];
  if (!validTypes.includes(resType)) {
    return res.status(400).json({ error: "Invalid type. Use notes, flashcards, videos, or practice" });
  }

  const course = courses.find((c) => c.id === courseId);
  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }

  const filtered = resources.filter((r) => r.courseId === courseId && r.category === resType);

  return res.status(200).json({
    message: `${resType} for ${course.name}`,
    courseId,
    type: resType,
    resources: filtered,
  });
});

module.exports = router;
