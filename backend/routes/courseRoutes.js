const express = require("express");
const Course = require("../models/Course");
const User = require("../models/User");

const router = express.Router();

// Get all courses with filtering
router.get("/", async (req, res) => {
  try {
    const {
      department,
      difficulty,
      workload,
      tags,
      semester,
      search,
      sort = "totalRankings"
    } = req.query;

    let query = Course.find();

    // Apply filters
    if (department) query = query.where("department").equals(department);
    if (difficulty) query = query.where("difficulty").lte(Number(difficulty));
    if (workload) query = query.where("workload").lte(Number(workload));
    if (tags) query = query.where("tags").in(tags.split(","));
    if (semester) query = query.where("semester").in(semester.split(","));
    if (search) {
      query = query.or([
        { title: new RegExp(search, "i") },
        { code: new RegExp(search, "i") },
        { description: new RegExp(search, "i") }
      ]);
    }

    // Apply sorting
    const sortOptions = {
      totalRankings: { totalRankings: -1 },
      difficulty: { difficulty: 1 },
      workload: { workload: 1 }
    };
    query = query.sort(sortOptions[sort] || sortOptions.totalRankings);

    const courses = await query.exec();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new course
router.post("/", async (req, res) => {
  const { title, code, description, department, prerequisites, credits, tags, semester } = req.body;
  
  if (!title || !code || !description || !department || !credits) {
    return res.status(400).json({ 
      error: "Title, code, description, department, and credits are required" 
    });
  }

  try {
    const newCourse = new Course({
      title,
      code,
      description,
      department,
      prerequisites: prerequisites || [],
      credits,
      tags: tags || [],
      semester: semester || []
    });
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get course by ID with reviews
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("reviews.user", "name");
    
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add review to course
router.post("/:id/reviews", async (req, res) => {
  const { userId, content, difficulty, workload } = req.body;
  
  try {
    const [course, user] = await Promise.all([
      Course.findById(req.params.id),
      User.findById(userId)
    ]);
    
    if (!course || !user) {
      return res.status(404).json({ 
        error: !course ? "Course not found" : "User not found" 
      });
    }
    
    // Add review
    course.reviews.push({
      user: userId,
      content,
      difficulty,
      workload
    });
    
    // Update course average ratings
    const avgDifficulty = course.reviews.reduce((sum, r) => sum + r.difficulty, 0) / course.reviews.length;
    const avgWorkload = course.reviews.reduce((sum, r) => sum + r.workload, 0) / course.reviews.length;
    
    course.difficulty = avgDifficulty;
    course.workload = avgWorkload;
    
    // Update user stats
    user.stats.reviewsWritten += 1;
    
    // Check for review milestones
    const milestones = [5, 10, 25, 50];
    if (milestones.includes(user.stats.reviewsWritten)) {
      await user.addAchievement(
        "review_contributor",
        `${user.stats.reviewsWritten} Reviews`,
        `Wrote ${user.stats.reviewsWritten} course reviews!`
      );
    }
    
    await Promise.all([course.save(), user.save()]);
    
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get course statistics
router.get("/:id/stats", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("reviews.user", "name");
    
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    
    const stats = {
      totalRankings: course.totalRankings,
      averageDifficulty: course.difficulty,
      averageWorkload: course.workload,
      totalReviews: course.reviews.length,
      difficultyDistribution: Array(5).fill(0),
      workloadDistribution: Array(5).fill(0)
    };
    
    // Calculate rating distributions
    course.reviews.forEach(review => {
      stats.difficultyDistribution[review.difficulty - 1]++;
      stats.workloadDistribution[review.workload - 1]++;
    });
    
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a course
router.delete("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Remove course from all users' rankings
    await User.updateMany(
      { "rankedCourses.course": req.params.id },
      { $pull: { rankedCourses: { course: req.params.id } } }
    );

    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
