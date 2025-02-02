const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  rank: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);