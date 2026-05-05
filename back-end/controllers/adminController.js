const mongoose = require("mongoose");
const Course = require("../models/Course");
const Resource = require("../models/Resource");
const { campusRepUsers } = require("../data/adminData");
const {
  typeLabelFromCategory,
  recentLabelFromDate,
  pendingResourceCategoryLabel,
} = require("../lib/courseMappers");

const getDashboard = async (req, res) => {
  try {
    const [verifiedCourses, verifiedResources] = await Promise.all([
      Course.countDocuments({ status: "approved" }),
      Resource.countDocuments({ verified: true }),
    ]);
    return res.json({
      campusCode: "CMP1001",
      verifiedCourses,
      verifiedResources,
    });
  } catch (err) {
    return res.status(500).json({ error: "Could not load dashboard" });
  }
};

const getPending = async (req, res) => {
  try {
    const { kind, category } = req.query;
    const wantCourse = !kind || kind.toLowerCase() === "course";
    const wantResource = !kind || kind.toLowerCase() === "resource";
    const catQ = (category && category.trim()) || "";
    const catMatch = (val) =>
      !catQ || String(val).toLowerCase() === catQ.toLowerCase();

    const out = [];
    if (wantCourse) {
      const courses = await Course.find({ status: "pending" }).lean();
      for (const c of courses) {
        if (!catMatch(c.category)) continue;
        out.push({
          id: `course-${c._id}`,
          courseId: c._id.toString(),
          kind: "Course",
          name: c.name,
          category: c.category,
          status: "pending",
        });
      }
    }
    if (wantResource) {
      const resources = await Resource.find({ verified: false })
        .populate("course")
        .sort({ uploadedAt: -1 })
        .lean();
      for (const r of resources) {
        if (!r.course) continue;
        const resCat = pendingResourceCategoryLabel(r.category);
        if (!catMatch(resCat)) continue;
        const cRef = r.course;
        const cid =
          typeof cRef === "object" && cRef._id
            ? cRef._id.toString()
            : cRef.toString();
        out.push({
          id: `resource-${r._id}`,
          courseId: cid,
          kind: "Resource",
          name: r.title,
          category: resCat,
          status: "pending",
        });
      }
    }
    return res.json(out);
  } catch (err) {
    return res.status(500).json({ error: "Could not load pending list" });
  }
};

const getCourseById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid course id" });
  }
  const course = await Course.findById(id);
  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }
  return res.json({
    id: course._id.toString(),
    name: course.name,
    description: course.description,
    school: course.school,
    imageFileName: course.imageFileName,
    duration: course.duration,
    level: course.level,
    whatYoullLearn: course.whatYoullLearn,
    modules: course.modules,
    status: course.status,
  });
};

const approveCourse = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid course id" });
  }
  const course = await Course.findByIdAndUpdate(
    id,
    { status: "approved" },
    { returnDocument: "after" }
  );
  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }
  res.json({ success: true, message: `Course ${id} approved` });
};

const rejectCourse = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid course id" });
  }
  const course = await Course.findByIdAndUpdate(
    id,
    { status: "rejected" },
    { returnDocument: "after" }
  );
  if (!course) {
    return res.status(404).json({ error: "Course not found" });
  }
  res.json({ success: true, message: `Course ${id} rejected` });
};

const toAdminResource = (r) => ({
  id: r._id.toString(),
  title: r.title,
  type: typeLabelFromCategory(r.category),
  format: "File",
  added: recentLabelFromDate(r.uploadedAt),
  fileName: r.fileName,
  fileUrl: r.fileName ? `http://localhost:5001/uploads/resources/${r.fileName}` : null,
});

const getResourceById = async (req, res) => {
  const { id: courseId } = req.params;
  if (!mongoose.isValidObjectId(courseId)) {
    return res.status(400).json({ error: "Invalid course id" });
  }
  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({ error: "Resource not found" });
  }
  const resDocs = await Resource.find({ course: courseId });
  const types = [...new Set(resDocs.map((r) => typeLabelFromCategory(r.category)))];
  return res.json({
    courseId: course._id.toString(),
    courseName: course.name,
    types,
    resourceTypes: types.join(", "),
    resources: resDocs.map(toAdminResource),
    status: "pending",
  });
};

const approveResource = async (req, res) => {
  const { id: courseId } = req.params;
  if (!mongoose.isValidObjectId(courseId)) {
    return res.status(400).json({ error: "Invalid course id" });
  }
  const n = await Resource.updateMany(
    { course: courseId },
    { $set: { verified: true } }
  );
  if (n.matchedCount === 0) {
    return res.status(404).json({ error: "Resource not found" });
  }
  res.json({ success: true, message: `Resources for course ${courseId} approved` });
};

const rejectResource = async (req, res) => {
  const { id: courseId } = req.params;
  if (!mongoose.isValidObjectId(courseId)) {
    return res.status(400).json({ error: "Invalid course id" });
  }
  const n = await Resource.deleteMany({ course: courseId });
  if (n.deletedCount === 0) {
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
