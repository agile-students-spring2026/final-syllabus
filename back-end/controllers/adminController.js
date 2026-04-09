const { courses } = require("../data/courses");
const { dashboard, pendingCourses, pendingResources, campusRepUsers } = require("../data/adminData");

const getDashboard = (req, res) => {
  res.json(dashboard);
};

const getPending = (req, res) => {
  const { kind, category } = req.query;
  let items = [...pendingCourses, ...pendingResources];
  if (kind) items = items.filter((i) => i.kind.toLowerCase() === kind.toLowerCase());
  if (category) items = items.filter((i) => i.category.toLowerCase() === category.toLowerCase());
  res.json(items);
};

const getCourseById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const course = courses.find((c) => c.id === id);
  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }
  res.json({
    id: course.id,
    name: course.name,
    description: course.description,
    category: course.category,
    instructor: course.instructor,
    duration: course.duration,
    level: course.level,
    whatYoullLearn: course.whatYoullLearn,
    modules: course.modules,
    status: "pending",
  });
};

const approveCourse = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const course = courses.find((c) => c.id === id);
  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }
  res.json({ success: true, message: `Course ${id} approved` });
};

const rejectCourse = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const course = courses.find((c) => c.id === id);
  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }
  res.json({ success: true, message: `Course ${id} rejected` });
};

const getResourceById = (req, res) => {
  const courseId = parseInt(req.params.id, 10);
  const course = courses.find((c) => c.id === courseId);
  if (!course) {
    return res.status(404).json({ error: "Resource not found" });
  }
  const types = [...new Set(course.resources.map((r) => r.type))];
  res.json({
    courseId: course.id,
    courseName: course.name,
    types,
    resourceTypes: types.join(", "),
    resources: course.resources,
    status: "pending",
  });
};

const approveResource = (req, res) => {
  const courseId = parseInt(req.params.id, 10);
  const course = courses.find((c) => c.id === courseId);
  if (!course) {
    return res.status(404).json({ error: "Resource not found" });
  }
  res.json({ success: true, message: `Resources for course ${courseId} approved` });
};

const rejectResource = (req, res) => {
  const courseId = parseInt(req.params.id, 10);
  const course = courses.find((c) => c.id === courseId);
  if (!course) {
    return res.status(404).json({ error: "Resource not found" });
  }
  res.json({ success: true, message: `Resources for course ${courseId} rejected` });
};

const getUsers = (req, res) => {
  res.json(campusRepUsers);
};

module.exports = {
  getDashboard,
  getPending,
  getCourseById,
  approveCourse,
  rejectCourse,
  getResourceById,
  approveResource,
  rejectResource,
  getUsers,
};
