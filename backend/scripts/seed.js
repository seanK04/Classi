const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');

require('dotenv').config();

const sampleCourses = [
  {
    title: "Introduction to Computer Science",
    code: "CS101",
    description: "Fundamental concepts of programming and computer science",
    department: "Computer Science",
    credits: 3,
    difficulty: 3,
    workload: 3,
    tags: ["Programming", "Fundamentals"],
    semester: ["Fall", "Spring"]
  },
  {
    title: "Data Structures",
    code: "CS201",
    description: "Advanced data structures and algorithms",
    department: "Computer Science",
    credits: 4,
    difficulty: 4,
    workload: 4,
    tags: ["Programming", "Algorithms"],
    semester: ["Spring"]
  },
  {
    title: "Linear Algebra",
    code: "MATH201",
    description: "Vectors, matrices, and linear transformations",
    department: "Mathematics",
    credits: 3,
    difficulty: 4,
    workload: 3,
    tags: ["Mathematics", "Theory"],
    semester: ["Fall", "Spring"]
  }
];

const sampleUsers = [
  {
    name: "Test User 1",
    email: "test1@example.com",
    preferences: {
      interests: ["Computer Science"],
      preferredDifficulty: 3,
      preferredWorkload: 3,
      preferredTags: ["Programming"]
    }
  },
  {
    name: "Test User 2",
    email: "test2@example.com",
    preferences: {
      interests: ["Mathematics"],
      preferredDifficulty: 4,
      preferredWorkload: 4,
      preferredTags: ["Theory"]
    }
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Course.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Insert courses
    const courses = await Course.insertMany(sampleCourses);
    console.log('Inserted sample courses');

    // Insert users
    const users = await User.insertMany(sampleUsers);
    console.log('Inserted sample users');

    // Add some rankings and reviews
    const [user1, user2] = users;
    const [course1, course2, course3] = courses;

    // Add rankings for user1
    await user1.insertCourseRanking(course1._id, [1]);
    await user1.insertCourseRanking(course2._id, [1, 0]);
    await user1.insertCourseRanking(course3._id, [0, 1, 1]);

    // Add rankings for user2
    await user2.insertCourseRanking(course3._id, [1]);
    await user2.insertCourseRanking(course1._id, [0, 1]);
    await user2.insertCourseRanking(course2._id, [1, 0, 0]);

    // Add reviews
    await Course.findByIdAndUpdate(course1._id, {
      $push: {
        reviews: {
          user: user1._id,
          content: "Great introductory course!",
          difficulty: 3,
          workload: 3
        }
      }
    });

    await Course.findByIdAndUpdate(course2._id, {
      $push: {
        reviews: {
          user: user2._id,
          content: "Challenging but rewarding",
          difficulty: 4,
          workload: 4
        }
      }
    });

    // Make users friends
    user1.friends.push(user2._id);
    user2.friends.push(user1._id);
    await Promise.all([user1.save(), user2.save()]);

    console.log('Added sample rankings, reviews, and friendships');
    console.log('\nTest Data Summary:');
    console.log('Users:', users.map(u => ({ id: u._id, name: u.name })));
    console.log('Courses:', courses.map(c => ({ id: c._id, code: c.code })));

    console.log('\nTest Commands:');
    console.log('1. Get all courses:');
    console.log('curl http://localhost:5000/api/courses');
    console.log('\n2. Get user1 rankings:');
    console.log(`curl http://localhost:5000/api/users/${user1._id}/rankings`);
    console.log('\n3. Get course1 stats:');
    console.log(`curl http://localhost:5000/api/courses/${course1._id}/stats`);
    console.log('\n4. Get user1 recommendations:');
    console.log(`curl http://localhost:5000/api/users/${user1._id}/recommendations`);

    await mongoose.disconnect();
    console.log('\nDatabase seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
