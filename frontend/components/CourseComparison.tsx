'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

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
}

export default function CourseComparison({ userId, onComplete }: ComparisonProps) {
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [position, setPosition] = useState<number>(0);
  const [left, setLeft] = useState<number>(0);
  const [right, setRight] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Get initial rankings count to set right bound
  const fetchInitialRankings = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/rankings`);
      const rankings = await response.json();
      setRight(rankings.length);
    } catch (error) {
      console.error('Error fetching rankings:', error);
    }
  };

  const fetchNextComparison = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/users/${userId}/next-comparison?left=${left}&right=${right}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();

      if (data.isComplete) {
        onComplete();
        return;
      }

      setCurrentCourse(data.course);
      setPosition(data.position);
    } catch (error) {
      console.error('Error fetching comparison:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChoice = async (higher: boolean) => {
    if (!currentCourse) return;

    try {
      setLoading(true);
      const newPosition = higher ? position + 1 : position;
      
      await fetch(`/api/users/${userId}/insert-ranking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: currentCourse._id,
          position: newPosition,
        }),
      });

      // Update binary search bounds
      if (higher) {
        setLeft(position + 1);
      } else {
        setRight(position);
      }

      await fetchNextComparison();
    } catch (error) {
      console.error('Error updating ranking:', error);
    }
  };

  useEffect(() => {
    const initializeComparison = async () => {
      await fetchInitialRankings();
      await fetchNextComparison();
    };
    initializeComparison();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentCourse) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto my-8">
      <h2 className="text-xl font-bold text-center text-blue-800 mb-6">
        Compare This Course
      </h2>
      
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-lg text-blue-900">
          {currentCourse.code} - {currentCourse.title}
        </h3>
        <p className="text-blue-700">{currentCourse.department}</p>
        <div className="mt-2 space-y-1">
          <p className="text-sm text-gray-600">
            Difficulty: {currentCourse.difficulty.toFixed(1)}/5.0
          </p>
          <p className="text-sm text-gray-600">
            Workload: {currentCourse.workload.toFixed(1)}/5.0
          </p>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
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
