const express = require("express");
const {
  getCourseById,
  saveCourseById,
  getCourseResourcesById
} = require("../controllers/courseController");

const router = express.Router();

// GET /courses/:id
router.get("/:id", getCourseById);

// POST /courses/:id/save
router.post("/:id/save", saveCourseById);

// GET /courses/:id/resources
router.get("/:id/resources", getCourseResourcesById);

module.exports = router;