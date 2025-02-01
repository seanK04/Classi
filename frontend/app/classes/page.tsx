'use client';

import { useState, useEffect } from 'react';
import { Share, Settings, Plus } from 'lucide-react';
import CourseComparison from '@/components/CourseComparison';

interface Course {
  _id: string;
  title: string;
  code: string;
  department: string;
  difficulty: number;
  workload: number;
}

interface RankedCourse {
  course: Course;
  rank: number;
}

// TODO: Replace with actual user ID from auth
const TEMP_USER_ID = '679e9dbf40e54ab1301b3d83';

export default function ClassesPage() {
  const [activeTab, setActiveTab] = useState('ranked');
  const [rankedCourses, setRankedCourses] = useState<RankedCourse[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRankedCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${TEMP_USER_ID}/rankings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch rankings');
      
      const data = await response.json();
      setRankedCourses(data.sort((a: RankedCourse, b: RankedCourse) => a.rank - b.rank));
    } catch (err) {
      setError('Failed to load your ranked courses. Please try again later.');
      console.error('Error fetching rankings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankedCourses();
  }, []);

  const handleComparisonComplete = () => {
    setIsComparing(false);
    fetchRankedCourses();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-blue-50 p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            onClick={fetchRankedCourses}
            className="mt-2 text-sm underline hover:text-red-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-md z-50">
        <div className="flex justify-between items-center px-4 py-3">
          <h1 className="text-xl font-bold text-blue-700">My Classes</h1>
          <div className="flex space-x-4">
            <Share className="w-6 h-6 text-blue-600 hover:text-blue-800 transition duration-200 cursor-pointer" />
            <Settings className="w-6 h-6 text-blue-600 hover:text-blue-800 transition duration-200 cursor-pointer" />
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex space-x-4 px-4 py-2 bg-blue-100 border-b border-blue-200">
        {[
          { id: 'ranked', label: 'Ranked Courses' },
          { id: 'wishlist', label: 'Wishlist' },
          { id: 'completed', label: 'Completed' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1 text-sm font-medium rounded-full transition duration-200 ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'text-blue-600 hover:bg-blue-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Comparison Interface */}
      {isComparing && (
        <CourseComparison 
          userId={TEMP_USER_ID} 
          onComplete={handleComparisonComplete} 
        />
      )}

      {/* Ranked List */}
      {!isComparing && (
        <div className="p-6 space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : rankedCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No ranked courses yet.</p>
              <button
                onClick={() => setIsComparing(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Rank Your First Course
              </button>
            </div>
          ) : (
            <>
              {rankedCourses.map(({ course, rank }, index) => (
                <div
                  key={course._id}
                  className="flex items-start justify-between bg-white p-5 rounded-xl shadow-lg border border-blue-200 hover:shadow-xl transition duration-200"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-lg text-blue-800">
                      {index + 1}. {course.code} - {course.title}
                    </p>
                    <p className="text-sm text-blue-600">{course.department}</p>
                    <div className="mt-1 space-x-4">
                      <span className="text-sm text-gray-500">
                        Difficulty: {course.difficulty.toFixed(1)}/5.0
                      </span>
                      <span className="text-sm text-gray-500">
                        Workload: {course.workload.toFixed(1)}/5.0
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={() => setIsComparing(true)}
                className="fixed bottom-16 right-4 flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Rank New Course
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
