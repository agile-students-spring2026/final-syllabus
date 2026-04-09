const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.js");
const homeRoutes = require("./routes/homeRoutes");
const courseRoutes = require("./routes/courses.js");
const resourceRoutes = require("./routes/resources.js");
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import courseRoutes from "./routes/courses.js";
import resourceRoutes from "./routes/resources.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Syllabus+ API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/home", homeRoutes);
app.use("/courses", courseRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
export default app;
