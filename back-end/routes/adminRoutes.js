const express = require("express");
const {
  getDashboard,
  getPending,
  getCourseById,
  approveCourse,
  rejectCourse,
  getResourceById,
  approveResource,
  rejectResource,
  getUsers,
} = require("../controllers/adminController");

const router = express.Router();

// Dashboard stats
router.get("/dashboard", getDashboard);

// Pending items list
router.get("/pending", getPending);

// Course review
router.get("/courses/:id", getCourseById);
router.post("/courses/:id/approve", approveCourse);
router.post("/courses/:id/reject", rejectCourse);

// Resource review (id = courseId)
router.get("/resources/:id", getResourceById);
router.post("/resources/:id/approve", approveResource);
router.post("/resources/:id/reject", rejectResource);

// Campus rep users
router.get("/users", getUsers);

module.exports = router;
