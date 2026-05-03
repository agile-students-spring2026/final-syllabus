const mongoose = require("mongoose");
const Course = require("../models/Course");
const Resource = require("../models/Resource");
const { recentLabelFromDate, toListItem, typeLabelFromCategory } = require("../lib/courseMappers");

const getHomepage = (_req, res) => {
  res.json({ message: "Welcome to the Course Sharing Platform API!" });
};

const RESOURCE_CATEGORIES = ["notes", "flashcards", "videos", "practice"];

const getAllCourses = async (req, res) => {
  try {
    const { search, category, recent, school, materialType } = req.query;

    const q = { status: { $ne: "rejected" } };
    if (search) {
      const s = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(s, "i");
      q.$or = [{ name: re }, { description: re }, { instructor: re }, { code: re }];
    }
    if (category && category !== "") {
      q.category = new RegExp(`^${category.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
    }
    if (school && school !== "") {
      q.school = new RegExp(`^${school.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
    }
    if (materialType && RESOURCE_CATEGORIES.includes(materialType)) {
      const withThisMaterial = await Resource.distinct("course", { category: materialType });
      q._id = { $in: withThisMaterial };
    }

    const courses = await Course.find(q);
    let results = courses.map(toListItem);
    if (recent && recent !== "") {
      results = results.filter((c) => c.recent === recent);
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Could not load courses" });
  }
};

const toDetailResource = (r) => ({
  id: r._id.toString(),
  title: r.title,
  type: typeLabelFromCategory(r.category),
  format: "File",
  added: recentLabelFromDate(r.uploadedAt),
  link: r.fileName,
});

const getCourseById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid course id" });
  }

  try {
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const resDocs = await Resource.find({ course: course._id }).sort({ uploadedAt: -1 });
    return res.json({
      id: course._id.toString(),
      name: course.name,
      code: course.code,
      description: course.description,
      category: course.category,
      school: course.school,
      coverImageUrl: course.coverImageUrl || "",
      recent: recentLabelFromDate(course.createdAt),
      instructor: course.instructor,
      duration: course.duration,
      level: course.level,
      whatYoullLearn: course.whatYoullLearn,
      modules: course.modules,
      status: course.status,
      resources: resDocs.map(toDetailResource),
    });
  } catch (err) {
    return res.status(500).json({ error: "Could not load course" });
  }
};

module.exports = { getHomepage, getAllCourses, getCourseById };
