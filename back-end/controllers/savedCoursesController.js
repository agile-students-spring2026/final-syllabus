const { validationResult } = require("express-validator");
const SavedCourse = require("../models/SavedCourse");

const getSavedCourses = async (req, res) => {
  try {
    const saved = await SavedCourse.find({ userId: req.user.id }).populate("courseId");
    const courses = saved.map((s) => s.courseId);
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch saved courses", detail: err.message });
  }
};

const saveCourse = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  try {
    const { courseId } = req.body;
    await SavedCourse.create({ userId: req.user.id, courseId });
    res.status(201).json({ message: "Course saved successfully", courseId });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Course already saved" });
    }
    res.status(500).json({ error: "Failed to save course", detail: err.message });
  }
};

const unsaveCourse = async (req, res) => {
  try {
    const result = await SavedCourse.deleteOne({
      userId: req.user.id,
      courseId: req.params.id,
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Saved course not found" });
    }
    res.json({ message: "Course removed from saved", courseId: req.params.id });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove saved course", detail: err.message });
  }
};

module.exports = { getSavedCourses, saveCourse, unsaveCourse };
