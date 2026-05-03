const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth.js");
const courseRoutes = require("./routes/courses.js");
const resourceRoutes = require("./routes/resources.js");
const homeRoutes = require("./routes/homeRoutes");
const savedCoursesRoutes = require("./routes/savedCoursesRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(cors());
// Base64 course images expand ~4/3 vs raw bytes; allow headroom beyond the 450KB client cap.
app.use(express.json({ limit: "2mb" }));

app.get("/", (_req, res) => {
  res.json({ message: "Syllabus+ API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api", homeRoutes);
app.use("/api/saved-courses", savedCoursesRoutes);
app.use("/api/admin", adminRoutes);

app.use((err, _req, res, _next) => {
  if (
    err?.status === 413 ||
    err?.statusCode === 413 ||
    err?.type === "entity.too.large"
  ) {
    return res.status(413).json({
      error:
        "Image or payload is too large for the server. Use a smaller image (max 450KB).",
    });
  }
  console.error(err);
  if (!res.headersSent) {
    res.status(err.statusCode || 500).json({ error: err.message || "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
