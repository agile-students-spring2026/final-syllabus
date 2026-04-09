const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.js");
const courseRoutes = require("./routes/courses.js");
const resourceRoutes = require("./routes/resources.js");
const homeRoutes = require("./routes/homeRoutes");
const savedCoursesRoutes = require("./routes/savedCoursesRoutes");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Syllabus+ API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api", homeRoutes);
app.use("/api/saved-courses", savedCoursesRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
