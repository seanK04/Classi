'use client';

import { useState } from 'react';
import { Search, Plus } from 'lucide-react';

interface Course {
  _id: string;
  title: string;
  code: string;
  department: string;
}

interface CourseSelectionProps {
  onCourseSelect: (courseId: string) => void;
  userId: string;
}

export default function CourseSelection({ onCourseSelect, userId }: CourseSelectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCourses = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/courses/search?q=${encodeURIComponent(query)}`);

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to search courses');
      }
      setSearchResults(data);
    } catch (err) {
      setError('Failed to search courses. Please try again.');
      console.error('Error searching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = async (courseId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Initial POST request to add course
      const response = await fetch(`/api/users/${userId}/rankings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
      });

      if (!response.ok) {
        throw new Error('Failed to add course');
      }

      onCourseSelect(courseId);
    } catch (err) {
      setError('Failed to add course. Please try again.');
      console.error('Error adding course:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto my-8">
      <h2 className="text-xl font-bold text-center text-blue-800 mb-6">
        Add a New Course
      </h2>

      <div className="relative">
        <div className="flex items-center border-2 border-blue-200 rounded-lg focus-within:border-blue-500">
          <Search className="w-5 h-5 ml-3 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              searchCourses(e.target.value);
            }}
            placeholder="Search for a course (e.g., CS200)"
            className="w-full px-4 py-3 focus:outline-none"
          />
        </div>

        {loading && (
          <div className="flex justify-center my-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="mt-4 border border-gray-200 rounded-lg divide-y">
            {searchResults.map((course) => (
              <div
                key={course._id}
                className="p-4 hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                onClick={() => handleCourseSelect(course._id)}
              >
                <div>
                  <p className="font-medium text-blue-900">
                    {course.code} - {course.title}
                  </p>
                  <p className="text-sm text-gray-600">{course.department}</p>
                </div>
                <Plus className="w-5 h-5 text-blue-600" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
