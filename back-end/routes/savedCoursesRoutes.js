const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getSavedCourses, saveCourse, unsaveCourse } = require("../controllers/savedCoursesController");

router.get("/", protect, getSavedCourses);

router.post(
  "/",
  protect,
  [body("courseId").notEmpty().withMessage("courseId is required").isMongoId().withMessage("Invalid courseId")],
  saveCourse
);

router.delete("/:id", protect, unsaveCourse);

module.exports = router;
