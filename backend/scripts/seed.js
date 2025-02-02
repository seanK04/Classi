require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('../models/Course');
const User = require('../models/User');

const courses = [
  {
    title: 'Introduction to Computer Science',
    code: 'CSCI 0150',
    description: 'An introduction to object-oriented programming and algorithmic problem solving.',
    department: 'Computer Science',
    prerequisites: [],
    credits: 4,
    difficulty: 3.5,
    workload: 4.0,
    tags: ['Programming', 'Algorithms', 'Java'],
    semester: ['Fall', 'Spring']
  },
  {
    title: 'Data Structures and Algorithms',
    code: 'CSCI 0160',
    description: 'Abstract data types and data structures. Analysis of algorithms.',
    department: 'Computer Science',
    prerequisites: ['CSCI 0150'],
    credits: 4,
    difficulty: 4.0,
    workload: 4.2,
    tags: ['Data Structures', 'Algorithms', 'Java'],
    semester: ['Fall', 'Spring']
  },
  {
    title: 'Linear Algebra',
    code: 'MATH 0520',
    description: 'Vector spaces, linear transformations, matrices, determinants, eigenvalues.',
    department: 'Mathematics',
    prerequisites: ['MATH 0100'],
    credits: 4,
    difficulty: 3.8,
    workload: 3.5,
    tags: ['Linear Algebra', 'Matrices', 'Proofs'],
    semester: ['Fall', 'Spring']
  },
  {
    title: 'Introduction to Software Engineering',
    code: 'CSCI 0320',
    description: 'Fundamentals of software design and development.',
    department: 'Computer Science',
    prerequisites: ['CSCI 0160'],
    credits: 4,
    difficulty: 3.7,
    workload: 4.5,
    tags: ['Software Engineering', 'Project', 'Team Work'],
    semester: ['Spring']
  },
  {
    title: 'Machine Learning',
    code: 'CSCI 1420',
    description: 'Introduction to machine learning algorithms and applications.',
    department: 'Computer Science',
    prerequisites: ['CSCI 0160', 'MATH 0520'],
    credits: 4,
    difficulty: 4.2,
    workload: 4.0,
    tags: ['AI', 'Machine Learning', 'Python'],
    semester: ['Fall']
  }
];

const testUser = {
  _id: '679e9dbf40e54ab1301b3d83',
  name: 'Test User',
  email: 'test@example.com',
  preferences: {
    interests: ['Computer Science', 'Mathematics'],
    preferredDifficulty: 3,
    preferredWorkload: 3,
    preferredTags: ['Programming', 'Algorithms']
  }
};

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Course.deleteMany({}),
      User.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Insert courses
    const insertedCourses = await Course.insertMany(courses);
    console.log('Inserted courses:', insertedCourses.map(c => c.code).join(', '));

    // Create test user
    const user = new User(testUser);
    
    // Add some initial rankings
    user.rankedCourses = [
      { course: insertedCourses[0]._id, rank: 0 },
      { course: insertedCourses[1]._id, rank: 1 }
    ];
    user.stats.totalRankings = 2;

    await user.save();
    console.log('Created test user with ID:', user._id);

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
