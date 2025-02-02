"use client";
import React, { useState } from "react";
import { Search, MapPin, Plus, Bookmark } from "lucide-react";
import RankCoursePrompt from "@/components/RankCoursePrompt";

export default function SearchPage() {
  const classResults = [
    {
      id: 1,
      name: "Intro to Object Oriented Programming",
      time: "10:00am - 10:50am",
    },
    {
      id: 2,
      name: "Data Structures and Algorithms",
      time: "11:00am - 11:50am",
    },
    {
      id: 3,
      name: "Linear Algebra",
      time: "9:00am - 9:50am",
    },
    {
      id: 4,
      name: "Introduction to Software Engineering",
      time: "2:00pm - 3:15pm",
    },
    {
      id: 5,
      name: "Machine Learning",
      time: "1:00pm - 2:15pm",
    },
  ];

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredResults, setFilteredResults] = useState(classResults);
  const [activeFilter, setActiveFilter] = useState<string>("Trending");
  const [showRankPrompt, setShowRankPrompt] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<{title: string; code: string} | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      applyFilter(activeFilter);
      return;
    }

    const results = classResults.filter((course) =>
      course.name.toLowerCase().split(" ").some((word) => word.startsWith(query))
    );
    setFilteredResults(results);
  };

  const applyFilter = (filter: string) => {
    if (filter === "Trending") {
      setFilteredResults(classResults.filter((course) => course.id <= 3));
    } else {
      setFilteredResults(classResults);
    }
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    applyFilter(filter);
  };

  const handleAddClick = (course: { id: number; name: string; time: string }) => {
    setSelectedCourse({
      title: course.name,
      code: course.id.toString()
    });
    setShowRankPrompt(true);
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

      {/* Filter Buttons */}
      <div className="flex space-x-3 p-4">
        <button
          className={`px-4 py-2 text-sm font-medium rounded-full shadow-md transition duration-200 ${
            activeFilter === "Trending"
              ? "text-white bg-blue-600 hover:bg-blue-700"
              : "text-blue-700 bg-blue-100 hover:bg-blue-200"
          }`}
          onClick={() => handleFilterChange("Trending")}
        >
          Trending
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium rounded-full shadow-md transition duration-200 ${
            activeFilter === "All"
              ? "text-white bg-blue-600 hover:bg-blue-700"
              : "text-blue-700 bg-blue-100 hover:bg-blue-200"
          }`}
          onClick={() => handleFilterChange("All")}
        >
          All
        </button>
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
                  onClick={() => handleAddClick(course)}
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

      {/* Rank Course Prompt */}
      {showRankPrompt && selectedCourse && (
        <RankCoursePrompt
          newCourse={selectedCourse}
          onComplete={async (rank) => {
            try {
              await fetch('http://localhost:3001/api/courses', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  title: selectedCourse.title,
                  code: selectedCourse.code,
                  rank
                })
              });
              setShowRankPrompt(false);
              setSelectedCourse(null);
            } catch (error) {
              console.error('Failed to save course:', error);
            }
          }}
          onCancel={() => {
            setShowRankPrompt(false);
            setSelectedCourse(null);
          }}
        />
      )}
    </div>
  );
}
