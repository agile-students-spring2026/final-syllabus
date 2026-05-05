const express = require("express");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const signToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

// POST /api/auth/signup
router.post(
  "/signup",
  [
    body("fullName").trim().notEmpty().withMessage("Full name is required"),
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("confirmPassword").notEmpty().withMessage("Confirm password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { fullName, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    try {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(409).json({ error: "Email already in use" });
      }

      const user = await User.create({ fullName, email, password, role: "student" });
      const token = signToken(user);

      return res.status(201).json({
        message: "Account created successfully",
        token,
        user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
      });
    } catch (err) {
      console.error("Signup error:", err.message);
      return res.status(500).json({ error: "Server error", detail: err.message });
    }
  }
);

// POST /api/auth/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = signToken(user);

      return res.status(200).json({
        message: "Login successful",
        token,
        user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
      });
    } catch (err) {
      console.error("Login error:", err.message);
      return res.status(500).json({ error: "Server error", detail: err.message });
    }
  }
);

// POST /api/auth/campus-rep/login
router.post(
  "/campus-rep/login",
  [
    body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email, role: "campus-rep" });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: "Invalid campus rep credentials" });
      }

      const token = signToken(user);

      return res.status(200).json({
        message: "Campus rep login successful",
        token,
        user: { id: user._id, name: user.fullName, email: user.email, role: "campus-rep" },
      });
    } catch (err) {
      return res.status(500).json({ error: "Server error" });
    }
  }
);

// PATCH /api/auth/profile
router.patch("/profile", protect, async (req, res) => {
  const { fullName } = req.body;
  if (!fullName || !fullName.trim()) {
    return res.status(400).json({ error: "Full name is required" });
  }
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { fullName: fullName.trim() }, { new: true });
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.status(200).json({
      message: "Profile updated",
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

// PATCH /api/auth/password
router.patch("/password", protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Current and new password are required" });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: "New password must be at least 6 characters" });
  }
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    const valid = await user.comparePassword(currentPassword);
    if (!valid) return res.status(401).json({ error: "Current password is incorrect" });
    user.password = newPassword;
    await user.save();
    return res.status(200).json({ message: "Password updated" });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/auth/account
router.delete("/account", protect, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.status(200).json({ message: "Account deleted" });
  } catch (err) {
    console.error("Delete account error:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
});

// PATCH /api/auth/role
router.patch("/role", protect, async (req, res) => {
  const { role } = req.body;
  if (!["student", "campus-rep"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { role }, { new: true });
    if (!user) return res.status(404).json({ error: "User not found" });
    const token = signToken(user);
    return res.status(200).json({
      message: "Role updated",
      token,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
    });
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
