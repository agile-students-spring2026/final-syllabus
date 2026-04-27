const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");

const Course = require("../models/Course");
const Resource = require("../models/Resource");
const { courses } = require("./courses");

const rawResources = [
  { title: "Week 1 Lecture Notes", category: "notes", fileName: "cs101_week1.pdf", uploadedBy: "user-1001", verified: true, courseIndex: 0 },
  { title: "Midterm Flashcards", category: "flashcards", fileName: "cs101_midterm_cards.json", uploadedBy: "user-1002", verified: false, courseIndex: 0 },
  { title: "Recursion Explained", category: "videos", fileName: "recursion_vid.mp4", uploadedBy: "user-1001", verified: true, courseIndex: 0 },
  { title: "Derivatives Practice Set", category: "practice", fileName: "calc_derivatives.pdf", uploadedBy: "user-1003", verified: false, courseIndex: 1 },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await Course.deleteMany({});
  await Resource.deleteMany({});

  const inserted = await Course.insertMany(courses);

  const resources = rawResources.map(({ courseIndex, ...r }) => ({
    ...r,
    course: inserted[courseIndex]._id,
  }));
  await Resource.insertMany(resources);

  console.log(`Seeded ${inserted.length} courses and ${resources.length} resources`);
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
