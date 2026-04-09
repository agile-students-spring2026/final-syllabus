const { courses, savedCoursesStore } = require("../data/courses");

const getSavedCourses = (req, res) => {
  const userId = req.query.userId || "guest";
  const savedIds = savedCoursesStore[userId] || [];
  const saved = courses.filter((c) => savedIds.includes(c.id));
  res.json(saved);
};

const saveCourse = (req, res) => {
  const { courseId, userId = "guest" } = req.body;

  if (!courseId) {
    return res.status(400).json({ error: "courseId is required" });
  }

  const course = courses.find((c) => c.id === parseInt(courseId, 10));
  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }

  if (!savedCoursesStore[userId]) {
    savedCoursesStore[userId] = [];
  }

  if (!savedCoursesStore[userId].includes(parseInt(courseId, 10))) {
    savedCoursesStore[userId].push(parseInt(courseId, 10));
  }

  res.status(201).json({ message: "Course saved successfully", courseId });
};

const unsaveCourse = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const userId = req.query.userId || "guest";

  if (!savedCoursesStore[userId]) {
    return res.status(404).json({ error: "No saved courses for this user" });
  }

  savedCoursesStore[userId] = savedCoursesStore[userId].filter((cid) => cid !== id);
  res.json({ message: "Course removed from saved", courseId: id });
};

module.exports = { getSavedCourses, saveCourse, unsaveCourse };
