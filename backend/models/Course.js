const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  difficulty: { type: Number, required: true, min: 1, max: 5 },
  workload: { type: Number, required: true, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now }
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  department: { type: String, required: true },
  professors: [{ type: String }],
  prerequisites: [{ type: String }],
  credits: { type: Number, required: true },
  difficulty: { type: Number, default: 0 }, // Avg difficulty rating
  workload: { type: Number, default: 0 }, // Avg workload rating
  reviews: [reviewSchema],
  totalRankings: { type: Number, default: 0 }, // Number of times this course has been ranked
  tags: [{ type: String }], // e.g., "Programming", "Theory", "Project-based"
  semester: [{ type: String }] // e.g., ["Fall", "Spring"]
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);
