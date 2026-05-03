const mongoose = require("mongoose");
require("dotenv").config();

const Course = require("./models/Course");
const { courses: rawCourses } = require("./data/courses");

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  await Course.deleteMany({});
  console.log("Cleared existing courses");

  const courses = rawCourses.map(({ id, ...rest }) => rest);

  await Course.insertMany(courses);
  console.log(`Inserted ${courses.length} courses`);

  await mongoose.disconnect();
  console.log("Done. Database seeded successfully.");
};

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
