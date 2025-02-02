const mongoose = require("mongoose");

const achievementSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., "ranking_milestone", "review_contributor"
  name: { type: String, required: true },
  description: { type: String, required: true },
  earnedAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  rankedCourses: [
    {
      course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
      rank: { type: Number, required: true }
    }
  ],
  achievements: [achievementSchema],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  preferences: {
    interests: [{ type: String }], // e.g., "Computer Science", "Mathematics"
    preferredDifficulty: { type: Number, min: 1, max: 5 },
    preferredWorkload: { type: Number, min: 1, max: 5 },
    preferredTags: [{ type: String }]
  },
  stats: {
    totalRankings: { type: Number, default: 0 },
    reviewsWritten: { type: Number, default: 0 },
    achievementCount: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Method to add achievement
userSchema.methods.addAchievement = async function(type, name, description) {
  this.achievements.push({ type, name, description });
  this.stats.achievementCount = this.achievements.length;
  await this.save();
};

// Method to get next course for comparison during binary search
userSchema.methods.getNextComparisonCourse = function(left, right) {
  // Sort rankings by rank to maintain order
  const currentRankings = this.rankedCourses.sort((a, b) => a.rank - b.rank);
  
  // If this is the first ranking, no comparison needed
  if (currentRankings.length === 0) {
    return { isComplete: true };
  }
  
  // If binary search bounds have crossed, we've found the position
  if (left > right) {
    return { isComplete: true };
  }
  
  const mid = Math.floor((left + right) / 2);
  
  // Return the course at the middle position for comparison
  // This will be used to determine if the new course should be ranked higher or lower
  return {
    course: currentRankings[mid].course,
    position: mid,
    isComplete: false
  };
};

// Method to update rankings using interactive binary search
userSchema.methods.insertCourseRanking = async function(courseId, position) {
  // Check if course is already ranked
  const existingIndex = this.rankedCourses.findIndex(
    rc => rc.course.toString() === courseId.toString()
  );
  
  // If course exists, remove it to be reinserted at new position
  if (existingIndex !== -1) {
    const oldRank = this.rankedCourses[existingIndex].rank;
    this.rankedCourses.splice(existingIndex, 1);
    
    // Adjust ranks of courses that were between old and new position
    this.rankedCourses.forEach(rc => {
      if (oldRank < position && rc.rank > oldRank && rc.rank <= position) {
        rc.rank -= 1;
      } else if (oldRank > position && rc.rank >= position && rc.rank < oldRank) {
        rc.rank += 1;
      }
    });
  }
  
  const currentRankings = this.rankedCourses.sort((a, b) => a.rank - b.rank);
  
  // If this is the first course being ranked
  if (currentRankings.length === 0) {
    this.rankedCourses.push({ course: courseId, rank: 0 });
    if (existingIndex === -1) this.stats.totalRankings += 1;
    await this.save();
    return 0;
  }
  
  // Shift existing rankings to make space for new course
  for (let i = 0; i < currentRankings.length; i++) {
    if (currentRankings[i].rank >= position) {
      currentRankings[i].rank += 1;
    }
  }
  
  // Insert the new course at the determined position
  this.rankedCourses.push({ course: courseId, rank: position });
  if (existingIndex === -1) this.stats.totalRankings += 1;
  
  // Check for ranking milestones
  const milestones = [10, 25, 50, 100];
  if (milestones.includes(this.stats.totalRankings)) {
    await this.addAchievement(
      'ranking_milestone',
      `${this.stats.totalRankings} Rankings`,
      `Ranked ${this.stats.totalRankings} courses!`
    );
  }
  
  await this.save();
  return position;
};

module.exports = mongoose.model("User", userSchema);
