const express = require("express");
const Course = require("../models/Course");

const router = express.Router();

// Get all courses sorted by rank
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find()
      .sort({ rank: -1 }) // Sort by rank in descending order
      .select('title code rank'); // Only return necessary fields
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new course with rank
router.post("/", async (req, res) => {
  const { title, code, rank } = req.body;
  
  if (!title || !code || rank === undefined) {
    return res.status(400).json({ 
      error: "Title, code, and rank are required" 
    });
  }

  try {
    // Increment ranks of all courses that will come after this one
    await Course.updateMany(
      { rank: { $gte: rank } },
      { $inc: { rank: 1 } }
    );

    // Create new course with the specified rank
    const newCourse = new Course({
      title,
      code,
      rank
    });
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a course
router.delete("/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
