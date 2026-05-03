const express = require("express");
const router = express.Router();
const { getHomepage, getAllCourses, getCourseById } = require("../controllers/homeController");
const { attachOptionalViewer } = require("../middleware/optionalViewer");

router.get("/", getHomepage);
router.get("/courses", attachOptionalViewer, getAllCourses);
router.get("/courses/:id", attachOptionalViewer, getCourseById);

module.exports = router;
