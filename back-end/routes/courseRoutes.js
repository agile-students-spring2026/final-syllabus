const express = require("express");
const {
  getCourseById,
  saveCourseById,
  getCourseResourcesById
} = require("../controllers/courseController");

const router = express.Router();

router.get("/:id", getCourseById);

router.post("/:id/save", saveCourseById);

router.get("/:id/resources", getCourseResourcesById);

module.exports = router;