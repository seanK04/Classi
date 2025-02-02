"use client";
import React, { useState, useEffect } from "react";
import { Search, MapPin, Plus, Bookmark } from "lucide-react";
import CourseComparison from "../../components/CourseComparison";

export default function SearchPage() {
  const classResults: Course[] = [
    { id: 1, name: "Intro to Object Oriented Programming", time: "10:00am - 10:50am" },
    { id: 2, name: "Data Structures and Algorithms", time: "11:00am - 11:50am" },
    { id: 3, name: "Linear Algebra", time: "9:00am - 9:50am" },
    { id: 4, name: "Introduction to Software Engineering", time: "2:00pm - 3:15pm" },
    { id: 5, name: "Machine Learning", time: "1:00pm - 2:15pm" },
  ];

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredResults, setFilteredResults] = useState(classResults);
  const [activeFilter, setActiveFilter] = useState<string>("Trending");
  const [comparingCourse, setComparingCourse] = useState<{
    id: number;
    name: string;
    time: string;
  } | null>(null);
  const [isComparisonComplete, setIsComparisonComplete] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setFilteredResults(classResults);
      return;
    }

    const results = classResults.filter((course) =>
      course.name.toLowerCase().split(" ").some((word) => word.startsWith(query))
    );
    setFilteredResults(results);
  };

  const handleAddClick = (course: Course) => {
    setSelectedCourse(course);
    setShowRankPrompt(true);
  };

  const handleRankSubmit = async (rank: number) => {
    if (!selectedCourse) return;

    try {
      const response = await fetch("http://localhost:3001/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: selectedCourse.name,
          code: selectedCourse.id.toString(),
          rank,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setRankedCourses(data.sortedCourses); // Update frontend with sorted courses
        alert(`${selectedCourse.name} added to your ranked list.`);
      } else {
        console.error("Failed to add course:", await response.json());
      }
    } catch (error) {
      console.error("Failed to add course:", error);
    } finally {
      setShowRankPrompt(false);
      setSelectedCourse(null);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-md z-50">
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
          <h1 className="text-blue-700 font-semibold">Search Classes</h1>
        </div>
      </header>

      {/* Search Bar */}
      <div className="p-4 bg-white shadow-sm">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 border border-gray-300 focus-within:ring focus-within:ring-blue-300">
          <Search className="w-5 h-5 text-gray-500 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search for a class, professor, or topic"
            className="w-full bg-transparent outline-none text-gray-700"
          />
        </div>
        <div className="mt-3 flex items-center space-x-2 text-gray-500">
          <MapPin className="w-5 h-5 text-gray-400" />
          <p className="text-sm">Brown University</p>
        </div>
      </div>

      {/* Search Results */}
      <div className="p-4 space-y-4">
        {filteredResults.length > 0 ? (
          filteredResults.map((course) => (
            <div
              key={course.id}
              className="flex items-center justify-between bg-white p-5 rounded-xl shadow-lg border border-blue-200 hover:shadow-xl transition duration-200"
            >
              <div>
                <p className="font-semibold text-lg text-blue-800">{course.name}</p>
                <p className="text-sm text-gray-500">{course.time}</p>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  className="text-gray-400 hover:text-blue-600 transition duration-200"
                  onClick={() => {
                    setComparingCourse(result);
                    setIsComparisonComplete(false);
                  }}
                >
                  <Plus className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-blue-600 transition duration-200">
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No results found.</p>
        )}
      </div>

      {/* Course Comparison Modal */}
      {comparingCourse && !isComparisonComplete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 m-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-blue-800">Rank This Course</h2>
              <button 
                onClick={() => setComparingCourse(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <CourseComparison
              userId="test-user"
              courseToCompare={comparingCourse}
              onComplete={() => {
                setIsComparisonComplete(true);
                setComparingCourse(null);
                // You could add a toast notification here
                // to confirm the course was added to rankings
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
