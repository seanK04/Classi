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

// Method to update rankings using binary search
userSchema.methods.insertCourseRanking = async function(courseId, comparisonResults) {
  const currentRankings = this.rankedCourses.sort((a, b) => a.rank - b.rank);
  let left = 0;
  let right = currentRankings.length;
  
  // Binary search to find insertion point
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (comparisonResults[mid] > 0) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  
  // Insert the new course at the determined position
  const newRank = left;
  
  // Shift existing rankings
  for (let i = 0; i < currentRankings.length; i++) {
    if (currentRankings[i].rank >= newRank) {
      currentRankings[i].rank += 1;
    }
  }
  
  this.rankedCourses.push({ course: courseId, rank: newRank });
  this.stats.totalRankings += 1;
  
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
  return newRank;
};

module.exports = mongoose.model("User", userSchema);
