const mongoose = require("mongoose");

const savedCourseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  },
  { timestamps: true }
);

// prevent a user from saving the same course twice
savedCourseSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model("SavedCourse", savedCourseSchema);
