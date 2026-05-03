const Course = require("../models/Course");
const Resource = require("../models/Resource");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { savedCoursesStore } = require("../data/savedCoursesStore");

const INVALID_OBJECTID = "507f1f77bcf86cd7994390aa";

/** Clears test collections and the in-memory saved-course store. */
async function clearTestData() {
  await Promise.all([Course.deleteMany({}), Resource.deleteMany({})]);
  Object.keys(savedCoursesStore).forEach((k) => {
    savedCoursesStore[k] = [];
  });
}

/**
 * Inserts a minimal set of documents used across route tests. Returns
 * id strings and documents where useful.
 */
async function seedMainFixtures() {
  await clearTestData();
  const now = new Date();
  const dayMs = 24 * 60 * 60 * 1000;
  const [calc, hist, today, other] = await Promise.all([
    Course.create({
      name: "MATH 201: Calculus II",
      code: "MATH201T",
      description: "Advanced integration, series, and applications of calculus.",
      category: "Mathematics",
      school: "Tulsa University",
      instructor: "Prof. Chen",
      whatYoullLearn: ["A"],
      modules: ["M1"],
    }),
    Course.create({
      name: "HIST 301: Modern History",
      code: "HIST301T",
      description: "Study major global events in the 20th century.",
      category: "History",
      school: "NYU",
      status: "pending",
      whatYoullLearn: ["A"],
      modules: ["M1"],
    }),
    Course.create({
      name: "Fresh Course Today",
      code: "FRESH1T",
      description: "Created in the last 24h for filter tests.",
      category: "Other",
      school: "NYU",
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    }),
    Course.create({
      name: "Older Course",
      code: "OLD1T",
      description: "For earlier bucket.",
      category: "Other",
      school: "NYU",
      createdAt: new Date(now.getTime() - 40 * dayMs),
    }),
  ]);
  const cs101 = await Course.create({
    name: "CS 101: Intro to Computer Science",
    code: "CS101T",
    description: "Learn the basics of programming, algorithms, and data structures.",
    category: "Computer Science",
    school: "NYU",
    whatYoullLearn: ["A", "B"],
    modules: ["M1", "M2"],
  });

  await Resource.create({
    title: "Week 1 notes",
    course: cs101._id,
    category: "notes",
    fileName: "week1.pdf",
  });
  await Resource.create({
    title: "Midterm",
    course: calc._id,
    category: "practice",
    fileName: "mid.pdf",
  });
  const pending = await Course.create({
    name: "Pending Review Course",
    code: "PEND1T",
    description: "Pending",
    category: "Physics",
    school: "NYU",
    status: "pending",
  });
  const rejectTarget = await Course.create({
    name: "Reject Me",
    code: "REJ1T",
    description: "X",
    category: "X",
    school: "NYU",
  });

  return {
    INVALID_OBJECTID,
    calcId: calc._id.toString(),
    histId: hist._id.toString(),
    todayId: today._id.toString(),
    olderId: other._id.toString(),
    cs101Id: cs101._id.toString(),
    pendingId: pending._id.toString(),
    rejectId: rejectTarget._id.toString(),
  };
}

/** JWT for a campus-rep with the given school (for admin route tests). */
async function campusRepBearerToken(school, email) {
  await User.deleteMany({ email });
  const u = await User.create({
    fullName: "Test Campus Rep",
    email,
    password: "password123",
    role: "campus-rep",
    school,
  });
  return jwt.sign(
    { id: u._id.toString(), email: u.email, role: u.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

module.exports = {
  clearTestData,
  seedMainFixtures,
  INVALID_OBJECTID,
  campusRepBearerToken,
};
