'use client';

import { useState } from 'react';
import CourseComparison from '../../components/CourseComparison';
import { getRankings } from '../../lib/rankingSystem';

export default function TestRanking() {
  const [isComplete, setIsComplete] = useState(false);

  const handleComplete = () => {
    setIsComplete(true);
  };

  const testCourse = {
    id: 999,
    name: "Data Structures and Algorithms",
    time: "CS201",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-8">
        Course Ranking System Test
      </h1>
      
      {!isComplete ? (
        <CourseComparison 
          userId="test-user" 
          onComplete={handleComplete}
          courseToCompare={testCourse}
        />
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-blue-800 mb-4">
            Final Rankings
          </h2>
          <ol className="list-decimal list-inside space-y-2">
            {getRankings().map((courseId, index) => (
              <li key={courseId} className="text-gray-700">
                Course ID: {courseId} (Rank: {index + 1})
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
