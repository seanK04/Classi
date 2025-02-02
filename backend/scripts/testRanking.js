const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');

async function testRankingSystem() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/classi');

        // Clear test data
        await User.deleteMany({ email: 'test@test.com' });
        await Course.deleteMany({ code: /TEST/ });

        // Create test courses
        const courses = await Promise.all([
            Course.create({
                title: 'Test Course 1',
                code: 'TEST101',
                description: 'Test course 1 description',
                department: 'TEST',
                credits: 3
            }),
            Course.create({
                title: 'Test Course 2',
                code: 'TEST102',
                description: 'Test course 2 description',
                department: 'TEST',
                credits: 3
            }),
            Course.create({
                title: 'Test Course 3',
                code: 'TEST103',
                description: 'Test course 3 description',
                department: 'TEST',
                credits: 3
            }),
            Course.create({
                title: 'Test Course 4',
                code: 'TEST104',
                description: 'Test course 4 description',
                department: 'TEST',
                credits: 3
            })
        ]);

        // Create test user
        const user = await User.create({
            name: 'Test User',
            email: 'test@test.com'
        });

        console.log('\n=== Testing Ranking System ===\n');

        // Test Case 1: First course (should automatically get rank 0)
        console.log('Test Case 1: Adding first course');
        const firstRank = await user.insertCourseRanking(courses[0]._id, 0);
        console.log('First course rank:', firstRank);
        console.assert(firstRank === 0, 'First course should have rank 0');

        // Test Case 2: Binary search process for second course
        console.log('\nTest Case 2: Adding second course with binary search');
        let left = 0;
        let right = user.rankedCourses.length;
        
        // Simulate binary search
        let comparison = user.getNextComparisonCourse(left, right);
        console.log('Comparison course:', comparison);
        // Simulate preferring new course (courses[1]) over existing course
        const secondRank = await user.insertCourseRanking(courses[1]._id, 0);
        console.log('Second course rank:', secondRank);

        // Test Case 3: More complex binary search
        console.log('\nTest Case 3: Adding third course with binary search');
        left = 0;
        right = user.rankedCourses.length;
        
        // First comparison
        comparison = user.getNextComparisonCourse(left, right);
        console.log('First comparison course:', comparison);
        // Simulate middle placement
        const thirdRank = await user.insertCourseRanking(courses[2]._id, 1);
        console.log('Third course rank:', thirdRank);

        // Verify final rankings
        const finalUser = await User.findById(user._id).populate('rankedCourses.course');
        console.log('\nFinal Rankings:');
        console.log('Ranked Courses (in order):');
        finalUser.rankedCourses
            .sort((a, b) => a.rank - b.rank)
            .forEach(ranking => {
                console.log(`Rank ${ranking.rank}: ${ranking.course.title} (${ranking.course.code})`);
            });

        // Verify stats
        console.log('\nUser Stats:');
        console.log('Total Rankings:', finalUser.stats.totalRankings);
        console.log('Achievements:', finalUser.achievements.length);

        // Critical Analysis
        console.log('\nCritical Analysis:');
        console.log('1. Rank Uniqueness:', 
            new Set(finalUser.rankedCourses.map(r => r.rank)).size === finalUser.rankedCourses.length 
            ? 'PASS' : 'FAIL - Duplicate ranks found');
        
        console.log('2. Rank Continuity:', 
            finalUser.rankedCourses.every(r => r.rank >= 0 && r.rank < finalUser.rankedCourses.length)
            ? 'PASS' : 'FAIL - Gaps in ranking');
        
        console.log('3. Stats Accuracy:',
            finalUser.stats.totalRankings === finalUser.rankedCourses.length
            ? 'PASS' : 'FAIL - Total rankings mismatch');

        await mongoose.disconnect();
        console.log('\nTest complete!');

    } catch (error) {
        console.error('Test failed:', error);
        await mongoose.disconnect();
    }
}

testRankingSystem();
