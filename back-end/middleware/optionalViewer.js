const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function attachOptionalViewer(req, res, next) {
  req.authUserId = null;
  req.viewerSchool = null;

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("school").lean();
    if (!user) {
      return next();
    }
    req.authUserId = user._id.toString();
    const trimmed = user.school && String(user.school).trim();
    req.viewerSchool = trimmed || null;
  } catch {
  }
  next();
}

module.exports = { attachOptionalViewer };
