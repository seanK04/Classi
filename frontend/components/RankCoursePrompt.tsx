'use client';

import { useState, useEffect } from 'react';

interface Course {
  _id: string;
  title: string;
  code: string;
  rank: number;
}

function useRankingLogic(onComplete: (rank: number) => void) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(-1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/courses');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const fetchedCourses = await response.json();
        const sortedCourses = [...fetchedCourses].sort((a, b) => a.rank - b.rank);
        
        setCourses(sortedCourses);
        setLow(0);
        setHigh(sortedCourses.length - 1);
        
        if (sortedCourses.length === 0) onComplete(0);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
        setLoading(false);
      }
    };
    fetchCourses();
  }, [onComplete]);

  const computeRank = (insertionIndex: number): number => {
    if (insertionIndex === 0) return 1;
    if (insertionIndex >= courses.length) {
      return courses.length === 0 ? 1 : courses[courses.length - 1].rank + 1;
    }
    return courses[insertionIndex - 1].rank + 1;
  };

  const handlePreference = (preferNew: boolean) => {
    const currentMid = Math.floor((low + high) / 2);
    let newLow = low;
    let newHigh = high;

    if (preferNew) {
      newHigh = currentMid - 1;
    } else {
      newLow = currentMid + 1;
    }

    if (newLow > newHigh) {
      const newRank = computeRank(newLow);
      onComplete(newRank);
    } else {
      setLow(newLow);
      setHigh(newHigh);
    }
  };

  const mid = low <= high ? Math.floor((low + high) / 2) : -1;
  const currentCourse = mid !== -1 ? courses[mid] : null;

  return { loading, currentCourse, handlePreference };
}

interface RankCoursePromptProps {
  newCourse: { title: string; code: string };
  onComplete: (rank: number) => void;
  onCancel: () => void;
}

export default function RankCoursePrompt({ newCourse, onComplete, onCancel }: RankCoursePromptProps) {
  const { loading, currentCourse, handlePreference } = useRankingLogic(onComplete);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p>Loading courses...</p>
        </div>
      </div>
    );
  }

  if (!currentCourse) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl text-indigo-800 font-bold mb-4">Which course do you prefer?</h2>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handlePreference(true)}
            className="p-4 border rounded hover:bg-blue-100 transition-colors"
          >
            <h3 className="font-bold text-black">{newCourse.title}</h3>
            <p className="text-sm text-gray-600">{newCourse.code}</p>
          </button>
          <button
            onClick={() => handlePreference(false)}
            className="p-4 border rounded hover:bg-blue-100 transition-colors"
          >
            <h3 className="font-bold text-black">{currentCourse.title}</h3>
            <p className="text-sm text-gray-600">{currentCourse.code}</p>
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