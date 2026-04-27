const mongoose = require("mongoose");
const Course = require("../models/Course");
const { savedCoursesStore } = require("../data/savedCoursesStore");
const { toListItem } = require("../lib/courseMappers");

const getSavedCourses = async (req, res) => {
  const userId = req.query.userId || "guest";
  const savedIds = savedCoursesStore[userId] || [];
  const validIds = savedIds.filter((x) => mongoose.isValidObjectId(x));
  const courses = await Course.find({ _id: { $in: validIds } });
  res.json(courses.map(toListItem));
};

const saveCourse = async (req, res) => {
  const { courseId, userId = "guest" } = req.body;

  if (!courseId) {
    return res.status(400).json({ error: "courseId is required" });
  }
  if (!mongoose.isValidObjectId(String(courseId))) {
    return res.status(400).json({ error: "Invalid course id" });
  }

  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }

  const idStr = String(courseId);
  if (!savedCoursesStore[userId]) {
    savedCoursesStore[userId] = [];
  }
  if (!savedCoursesStore[userId].includes(idStr)) {
    savedCoursesStore[userId].push(idStr);
  }

  res.status(201).json({ message: "Course saved successfully", courseId: idStr });
};

const unsaveCourse = (req, res) => {
  const id = String(req.params.id);
  const userId = req.query.userId || "guest";

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid course id" });
  }

  if (!savedCoursesStore[userId]) {
    return res.status(404).json({ error: "No saved courses for this user" });
  }

  const before = savedCoursesStore[userId].length;
  savedCoursesStore[userId] = savedCoursesStore[userId].filter((cid) => String(cid) !== id);
  if (savedCoursesStore[userId].length === before) {
    return res.status(404).json({ error: "No saved courses for this user" });
  }
  res.json({ message: "Course removed from saved", courseId: id });
};

module.exports = { getSavedCourses, saveCourse, unsaveCourse };
