const express = require("express");
const User = require("../models/User");
const Course = require("../models/Course");

const router = express.Router();

// Middleware to check if user exists
const checkUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new user with preferences
router.post("/", async (req, res) => {
  try {
    const { name, email, preferences } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const newUser = new User({ 
      name, 
      email,
      preferences: preferences || {
        interests: [],
        preferredDifficulty: 3,
        preferredWorkload: 3,
        preferredTags: []
      }
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user profile with rankings, achievements, and friends
router.get("/:id", checkUser, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("rankedCourses.course")
      .populate("friends", "name email");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user rankings
router.get("/:id/rankings", checkUser, async (req, res) => {
  try {
    await req.user.populate("rankedCourses.course");
    res.json(req.user.rankedCourses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Pairwise comparison endpoint
router.post("/:id/compare", checkUser, async (req, res) => {
  const { courseId, comparisonResults } = req.body;
  
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const newRank = await req.user.insertCourseRanking(courseId, comparisonResults);
    
    // Update course totalRankings
    course.totalRankings += 1;
    await course.save();
    
    res.json({ 
      newRank,
      totalRankings: req.user.stats.totalRankings,
      achievements: req.user.achievements
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add friend
router.post("/:id/friends", checkUser, async (req, res) => {
  const { friendId } = req.body;
  
  try {
    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({ error: "Friend not found" });
    }
    
    if (!req.user.friends.includes(friendId)) {
      req.user.friends.push(friendId);
      await req.user.save();
    }
    
    await req.user.populate("friends", "name email");
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update preferences
router.put("/:id/preferences", checkUser, async (req, res) => {
  const { preferences } = req.body;
  
  try {
    req.user.preferences = {
      ...req.user.preferences,
      ...preferences
    };
    await req.user.save();
    res.json(req.user.preferences);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get course recommendations based on preferences and friend rankings
router.get("/:id/recommendations", checkUser, async (req, res) => {
  try {
    await req.user
      .populate("friends")
      .populate({
        path: "friends",
        populate: { path: "rankedCourses.course" }
      });

    const friendRankings = req.user.friends.reduce((acc, friend) => {
      friend.rankedCourses.forEach(({ course, rank }) => {
        if (!acc[course._id]) {
          acc[course._id] = {
            course,
            totalRank: 0,
            count: 0
          };
        }
        acc[course._id].totalRank += rank;
        acc[course._id].count += 1;
      });
      return acc;
    }, {});

    // Convert to array and sort by average rank
    const recommendations = Object.values(friendRankings)
      .map(({ course, totalRank, count }) => ({
        course,
        averageRank: totalRank / count,
        friendCount: count
      }))
      .sort((a, b) => a.averageRank - b.averageRank)
      .filter(rec => !req.user.rankedCourses.some(rc => 
        rc.course.toString() === rec.course._id.toString()
      ));

    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
