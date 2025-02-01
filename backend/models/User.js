const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  rankedCourses: [
    {
      course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
      rank: { type: Number, required: true }
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);