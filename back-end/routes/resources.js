const express = require("express");
import express from "express";
const { courses, resources } = require("../data/store.js");
import { courses, resources } from "../data/store.js";

const router = express.Router();

// POST /api/resources/upload - upload a new resource to a course
router.post("/upload", (req, res) => {
  const { title, courseId, category, fileName, uploadedBy } = req.body;

  if (!title || !courseId || !category || !fileName) {
    return res.status(400).json({ error: "title, courseId, category, and fileName are all required" });
  }

  const validCategories = ["notes", "flashcards", "videos", "practice"];
  if (!validCategories.includes(category)) {
    return res.status(400).json({ error: "category has to be notes, flashcards, videos, or practice" });
  }

  // make sure course exists before uploading
  const courseExists = courses.find((c) => c.id === courseId);
  if (!courseExists) {
    return res.status(404).json({ error: "Course not found, cant upload to a course that doesnt exist" });
  }

  const resObj = {
    id: `res-${Date.now()}`,
    title,
    courseId,
    category,
    fileName,
    uploadedBy: uploadedBy || "anonymous",
    uploadedAt: new Date().toISOString(),
    verified: false,
  };
  resources.push(resObj);

  return res.status(201).json({
    message: "Resource uploaded",
    resource: resObj,
  });
});

// GET /api/resources/history - get all uploads sorted by recent
router.get("/history", (req, res) => {
  // sort by newest first
  const sorted = [...resources].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

  return res.status(200).json({
    message: "Upload history",
    total: sorted.length,
    resources: sorted,
  });
});

// GET /api/resources/verification - check whats verified and whats not
router.get("/verification", (req, res) => {
  const verifyList = resources.map((r) => ({
    id: r.id,
    title: r.title,
    courseId: r.courseId,
    category: r.category,
    verified: r.verified,
    uploadedBy: r.uploadedBy,
    uploadedAt: r.uploadedAt,
  }));

  const verifiedCount = resources.filter((r) => r.verified).length;
  const unverifiedCount = resources.filter((r) => !r.verified).length;

  return res.status(200).json({
    message: "Resource verification status",
    verified: verifiedCount,
    unverified: unverifiedCount,
    resources: verifyList,
  });
});

module.exports = router;
export default router;
