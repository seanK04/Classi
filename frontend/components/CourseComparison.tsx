'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { findInsertionPosition, insertCourse, getRankingsSize, getRankings } from '../lib/rankingSystem';

interface Course {
  _id: string;
  title: string;
  code: string;
  department: string;
  difficulty: number;
  workload: number;
}

interface ComparisonProps {
  userId: string;
  onComplete: () => void;
  courseToCompare?: {
    id: number;
    name: string;
    time: string;
  };
}

export default function CourseComparison({ userId, onComplete, courseToCompare }: ComparisonProps) {
  const [newCourse, setNewCourse] = useState<Course | null>(null);
  const [comparisonCourse, setComparisonCourse] = useState<Course | null>(null);
  const [position, setPosition] = useState<number>(0);
  const [left, setLeft] = useState<number>(0);
  const [right, setRight] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const getNextComparison = () => {
    if (!newCourse) {
      console.log('No new course to compare');
      return;
    }
    
    try {
      console.log('Getting next comparison with bounds:', { left, right });
      const { position: newPosition, courseToCompare, isComplete } = findInsertionPosition(left, right);
      console.log('Got comparison result:', { newPosition, courseToCompare, isComplete });
      
      if (isComplete) {
        console.log('Comparison complete, inserting course at position:', newPosition);
        insertCourse(newCourse, newPosition);
        onComplete();
        return;
      }

      setPosition(newPosition);
      setComparisonCourse(courseToCompare);
      setLoading(false);
      console.log('Set comparison course:', courseToCompare);
    } catch (error) {
      console.error('Error getting next comparison:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseToCompare) {
      console.log('Initializing comparison with course:', courseToCompare);
      setRight(getRankingsSize());
      const course: Course = {
        _id: courseToCompare.id.toString(),
        title: courseToCompare.name,
        code: courseToCompare.time,
        department: "",
        difficulty: 0,
        workload: 0,
      };
      setNewCourse(course);
    }
  }, [courseToCompare]);

  // Effect to handle comparison when bounds change
  useEffect(() => {
    if (newCourse) {
      getNextComparison();
    }
  }, [left, right, newCourse]);

  const handleChoice = (higher: boolean) => {
    if (!newCourse) {
      console.log('No course to rank');
      return;
    }

    try {
      console.log('Handling choice:', higher ? 'higher' : 'lower');
      setLoading(true);
      
      // Update binary search bounds
      if (higher) {
        console.log('Moving bounds right:', { newLeft: position + 1, right });
        setLeft(position + 1);
      } else {
        console.log('Moving bounds left:', { left, newRight: position });
        setRight(position);
      }
    } catch (error) {
      console.error('Error updating ranking:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!newCourse) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto my-8">
      <h2 className="text-xl font-bold text-center text-blue-800 mb-6">
        Compare These Courses
      </h2>
      
      <div className="space-y-4">
        {/* New Course */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-lg text-blue-900">
            {newCourse.code} - {newCourse.title}
          </h3>
          <p className="text-blue-700">{newCourse.department}</p>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-gray-600">
              Difficulty: {newCourse.difficulty.toFixed(1)}/5.0
            </p>
            <p className="text-sm text-gray-600">
              Workload: {newCourse.workload.toFixed(1)}/5.0
            </p>
          </div>
        </div>

        {/* Comparison Course */}
        {comparisonCourse && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg text-gray-900">
              {comparisonCourse.code} - {comparisonCourse.title}
            </h3>
            <p className="text-gray-700">{comparisonCourse.department}</p>
            <div className="mt-2 space-y-1">
              <p className="text-sm text-gray-600">
                Difficulty: {comparisonCourse.difficulty.toFixed(1)}/5.0
              </p>
              <p className="text-sm text-gray-600">
                Workload: {comparisonCourse.workload.toFixed(1)}/5.0
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center space-x-4 mt-6">
        <button
          onClick={() => handleChoice(false)}
          className="flex items-center px-6 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Rank Lower
        </button>
        <button
          onClick={() => handleChoice(true)}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Rank Higher
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
}
