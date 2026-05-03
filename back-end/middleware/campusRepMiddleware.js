const User = require("../models/User");
const { protect } = require("./authMiddleware");

const loadCampusRepForAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("role school").lean();
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    if (user.role !== "campus-rep") {
      return res.status(403).json({ error: "Campus rep access only" });
    }
    const school = (user.school || "").trim();
    if (!school) {
      return res.status(403).json({
        error: "Set your university in your profile before using the dashboard",
      });
    }
    req.campusRepSchool = school;
    return next();
  } catch (err) {
    return next(err);
  }
};

const campusRepAdminChain = [protect, loadCampusRepForAdmin];

module.exports = { loadCampusRepForAdmin, campusRepAdminChain };
