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
const { protect } = require("../middleware/authMiddleware");
const { loadCampusRepForAdmin } = require("../middleware/campusRepMiddleware");

const router = express.Router();

router.use(protect, loadCampusRepForAdmin);

router.get("/dashboard", getDashboard);

router.get("/pending", getPending);

router.get("/courses/:id", getCourseById);
router.post("/courses/:id/approve", approveCourse);
router.post("/courses/:id/reject", rejectCourse);

router.get("/resources/:id", getResourceById);
router.post("/resources/:id/approve", approveResource);
router.post("/resources/:id/reject", rejectResource);

router.get("/users", getUsers);

module.exports = router;
