const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    instructor: { type: String, default: "TBD", trim: true },
    description: { type: String, default: "" },
    category: { type: String, default: "General", trim: true },
    school: { type: String, default: "—", trim: true },
    duration: { type: String, default: "", trim: true },
    level: { type: String, default: "", trim: true },
    whatYoullLearn: { type: [String], default: [] },
    modules: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

module.exports = mongoose.model("Course", courseSchema);
