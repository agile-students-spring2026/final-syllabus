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
    description: { type: String },
    category: { type: String, required: true },
    school: { type: String },
    instructor: { type: String },
    duration: String,
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"] },
    recent: { type: String, default: "Today" },
    whatYoullLearn: [String],
    modules: [String],
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },

  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
