const express = require("express");
const router = express.Router();
const { getHomepage, getAllCourses, getCourseById } = require("../controllers/homeController");

router.get("/", getHomepage);
router.get("/courses", getAllCourses);
router.get("/courses/:id", getCourseById);

module.exports = router;
