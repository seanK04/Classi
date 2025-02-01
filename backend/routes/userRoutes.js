const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Get user rankings
router.get("/:id/rankings", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("rankedCourses.course");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user.rankedCourses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user rankings
router.post("/:id/rankings", async (req, res) => {
  const { rankedCourses } = req.body; // Expects an array of { courseId, rank }

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Update user rankings
    user.rankedCourses = rankedCourses.map(({ courseId, rank }) => ({
      course: courseId,
      rank
    }));

    await user.save();
    res.json(user.rankedCourses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;