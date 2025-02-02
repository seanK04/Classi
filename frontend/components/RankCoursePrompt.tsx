'use client';

import { useState, useEffect } from 'react';

interface Course {
  _id: string;
  title: string;
  code: string;
  rank: number;
}

interface RankCoursePromptProps {
  newCourse: { title: string; code: string };
  onComplete: (rank: number) => void;
  onCancel: () => void;
}

export default function RankCoursePrompt({ newCourse, onComplete, onCancel }: RankCoursePromptProps) {
  const [rankedCourses, setRankedCourses] = useState<Course[]>([]);
  const [currentComparison, setCurrentComparison] = useState<Course | null>(null);
  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch ranked courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/courses');
        const courses = await response.json();
        // Courses are already sorted by rank from the backend
        const sortedCourses = courses;
        setRankedCourses(sortedCourses);
        setHigh(sortedCourses.length);
        // Start with middle course if any exist
        if (sortedCourses.length > 0) {
          setCurrentComparison(sortedCourses[Math.floor(sortedCourses.length / 2)]);
        } else {
          // If no courses exist, assign rank of 0
          handleComplete(0);
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handlePrefer = (preferNew: boolean) => {
    if (!currentComparison) return;

    const mid = Math.floor((low + high) / 2);
    
    if (high - low <= 1) {
      // We've found the insertion point
      // If preferNew is true, insert at current position
      // If preferNew is false, insert after current position
      const insertionIndex = preferNew ? currentComparison.rank - 1 : currentComparison.rank;
      const newRank = insertionIndex + 1;
      
      // All courses after this point will need their ranks incremented by 1
      // This will be handled by the backend when saving the new course
      handleComplete(newRank);
      return;
    }

    if (preferNew) {
      // New course is preferred, look in upper half
      setHigh(mid);
      const nextIndex = Math.floor((low + mid) / 2);
      setCurrentComparison(rankedCourses[nextIndex]);
    } else {
      // Existing course is preferred, look in lower half
      setLow(mid);
      const nextIndex = Math.floor((mid + high) / 2);
      setCurrentComparison(rankedCourses[nextIndex]);
    }
  };

  const handleComplete = (rank: number) => {
    onComplete(rank);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p>Loading courses...</p>
        </div>
      </div>
    );
  }

  if (!currentComparison && rankedCourses.length > 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p>Error loading comparison</p>
          <button 
            onClick={onCancel}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl text-black font-bold mb-4">Which course do you prefer?</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {/* New Course Button */}
          <button
            onClick={() => handlePrefer(true)}
            className="p-4 border rounded hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-bold text-black">{newCourse.title}</h3>
            <p className="text-sm text-gray-600">{newCourse.code}</p>
          </button>

          {/* Comparison Course Button */}
          <button
            onClick={() => handlePrefer(false)}
            className="p-4 border rounded hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-bold text-black">{currentComparison?.title}</h3>
            <p className="text-sm text-gray-600">{currentComparison?.code}</p>
          </button>
        </div>

        <button 
          onClick={onCancel}
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
