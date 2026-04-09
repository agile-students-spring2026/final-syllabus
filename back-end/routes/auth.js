const express = require("express");
import express from "express";

const router = express.Router();

// In-memory mock user store (no database this sprint)
const users = [];
const campusReps = [
  { id: "rep-1", email: "rep@school.edu", password: "rep123", name: "Campus Rep" },
];

// POST /api/auth/signup
router.post("/signup", (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;

  if (!fullName || !email || !password || !confirmPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(409).json({ error: "Email already in use" });
  }

  const newUser = {
    id: `user-${Date.now()}`,
    fullName,
    email,
    password,
    role: "student",
  };
  users.push(newUser);

  return res.status(201).json({
    message: "Account created successfully",
    user: { id: newUser.id, fullName: newUser.fullName, email: newUser.email, role: newUser.role },
  });
});

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  return res.status(200).json({
    message: "Login successful",
    user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
  });
});

// POST /api/auth/campus-rep/login
router.post("/campus-rep/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const rep = campusReps.find((r) => r.email === email && r.password === password);
  if (!rep) {
    return res.status(401).json({ error: "Invalid campus rep credentials" });
  }

  return res.status(200).json({
    message: "Campus rep login successful",
    user: { id: rep.id, name: rep.name, email: rep.email, role: "campus-rep" },
  });
});

module.exports = router;
export default router;
