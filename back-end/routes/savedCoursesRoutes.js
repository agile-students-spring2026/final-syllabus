const express = require("express");
const router = express.Router();
const { getSavedCourses, saveCourse, unsaveCourse } = require("../controllers/savedCoursesController");

router.get("/", getSavedCourses);
router.post("/", saveCourse);
router.delete("/:id", unsaveCourse);

module.exports = router;
