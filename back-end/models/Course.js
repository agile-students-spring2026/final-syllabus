const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: String,
  format: String,
  added: String,
  link: String,
});

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, trim: true, unique: true, sparse: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    school: { type: String, required: true },
    instructor: { type: String, required: true },
    duration: String,
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"] },
    recent: { type: String, default: "Today" },
    coverImageUrl: { type: String, trim: true, default: "" },
    whatYoullLearn: [String],
    modules: [String],
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
