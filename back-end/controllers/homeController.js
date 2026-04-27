const Course = require("../models/Course");

const getHomepage = (_req, res) => {
  res.json({ message: "Welcome to the Course Sharing Platform API!" });
};

const getAllCourses = async (req, res) => {
  try {
    const { search, category, recent, school } = req.query;
    const filter = {};

    if (category) filter.category = new RegExp(category, "i");
    if (recent) filter.recent = recent;
    if (school) filter.school = new RegExp(school, "i");
    if (search) {
      filter.$or = [
        { name: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
        { instructor: new RegExp(search, "i") },
      ];
    }

    const courses = await Course.find(filter);
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch courses", detail: err.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch course", detail: err.message });
  }
};

module.exports = { getHomepage, getAllCourses, getCourseById };
