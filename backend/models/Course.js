const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  professors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Professor" }],
  difficulty: { type: Number, default: 0 }, // Avg difficulty rating
  workload: { type: Number, default: 0 } // Avg workload rating
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);