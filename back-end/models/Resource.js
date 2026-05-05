const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    category: {
      type: String,
      required: true,
      enum: ["notes", "flashcards", "past-questions", "videos", "practice"],
    },
    fileName: { type: String, required: true, trim: true },
    uploadedBy: { type: String, default: "anonymous", trim: true },
    uploadedAt: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false },
  },
  { toJSON: { virtuals: true } }
);

module.exports = mongoose.model("Resource", resourceSchema);
