const express = require("express");
const Course = require("../models/Course");

const router = express.Router();

// Get all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new course
router.post("/", async (req, res) => {
  const { title, code } = req.body;
  if (!title || !code) {
    return res.status(400).json({ error: "Title and code are required" });
  }

  try {
    const newCourse = new Course({ title, code });
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;