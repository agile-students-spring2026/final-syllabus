const { courses } = require("../data/courses");

const getHomepage = (req, res) => {
  res.json({ message: "Welcome to the Course Sharing Platform API!" });
};

const getAllCourses = (req, res) => {
  const { search, category, recent, school } = req.query;

  let results = [...courses];

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q)
    );
  }

  if (category && category !== "") {
    results = results.filter(
      (c) => c.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (recent && recent !== "") {
    results = results.filter(
      (c) => c.recent.toLowerCase() === recent.toLowerCase()
    );
  }

  if (school && school !== "") {
    results = results.filter(
      (c) => c.school.toLowerCase() === school.toLowerCase()
    );
  }

  res.json(results);
};

const getCourseById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const course = courses.find((c) => c.id === id);

  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }

  res.json(course);
};

module.exports = { getHomepage, getAllCourses, getCourseById };
