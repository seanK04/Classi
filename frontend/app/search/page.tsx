"use client"
import React, { useState } from "react";
import { Search, MapPin, Plus, Bookmark, X } from "lucide-react";

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
    {
      id: 6,
      name: "Organic Chemistry I",
      time: "10:30am - 11:45am",
    },
    {
      id: 7,
      name: "Genetics",
      time: "12:00pm - 12:50pm",
    },
    {
      id: 8,
      name: "Computational Biology",
      time: "3:30pm - 4:45pm",
    },
    {
      id: 9,
      name: "Introduction to Neuroscience",
      time: "8:30am - 9:45am",
    },
    {
      id: 10,
      name: "Statistical Inference",
      time: "4:00pm - 5:15pm",
    },
    {
      id: 11,
      name: "Introduction to Microeconomics",
      time: "9:30am - 10:45am",
    },
    {
      id: 12,
      name: "Analytical Mechanics",
      time: "1:30pm - 2:45pm",
    },
    {
      id: 13,
      name: "Modern World History",
      time: "10:00am - 11:15am",
    },
    {
      id: 14,
      name: "Introduction to Engineering",
      time: "11:30am - 12:45pm",
    },
    {
      id: 15,
      name: "Classical Mythology",
      time: "2:00pm - 3:15pm",
    },
    {
      id: 16,
      name: "Cognitive Psychology",
      time: "9:00am - 10:15am",
    },
    {
      id: 17,
      name: "Introduction to Sociology",
      time: "12:30pm - 1:45pm",
    },
    {
      id: 18,
      name: "Introduction to Linguistics",
      time: "3:00pm - 4:15pm",
    },
    {
      id: 19,
      name: "Organic Chemistry II",
      time: "10:30am - 11:45am",
    },
    {
      id: 20,
      name: "Macroeconomic Theory",
      time: "1:00pm - 2:15pm",
    },
  ];

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredResults, setFilteredResults] = useState(classResults);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setFilteredResults(classResults);
      return;
    }

    // Filter results by matching the beginning of words in the name
    const results = classResults.filter((course) =>
      course.name.toLowerCase().split(" ").some((word) => word.startsWith(query))
    );
    setFilteredResults(results);
  };

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-md z-50">
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
          <div className="flex space-x-6">
            <button className="text-blue-700 font-semibold border-b-2 border-blue-700">
              Classes
            </button>
            <button className="text-gray-500 hover:text-gray-700 transition duration-200">
              Members
            </button>
          </div>
          <button className="text-gray-500 hover:text-gray-700 transition duration-200">
            <X className="w-6 h-6" />
          </button>
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
        <div className="mt-3 flex items-center justify-between text-gray-500">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-gray-400" />
            <p className="text-sm">Brown University</p>
          </div>
          <button className="text-gray-500 hover:text-gray-700 transition duration-200">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-3 p-4">
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-full shadow-md hover:bg-blue-700 transition duration-200">
          Trending
        </button>
        <button className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-full shadow-md hover:bg-blue-200 transition duration-200">
          Friend Recs
        </button>
      </div>

      {/* Search Results */}
      <div className="p-4 space-y-4">
        {filteredResults.length > 0 ? (
          filteredResults.map((result) => (
            <div
              key={result.id}
              className="flex items-center justify-between bg-white p-5 rounded-xl shadow-lg border border-blue-200 hover:shadow-xl transition duration-200"
            >
              <div>
                <p className="font-semibold text-lg text-blue-800">{result.name}</p>
                <p className="text-sm text-gray-500">{result.time}</p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-gray-400 hover:text-blue-600 transition duration-200">
                  <Plus className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-blue-600 transition duration-200">
                  <Bookmark className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-red-600 transition duration-200">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No results found.</p>
        )}
      </div>
    </div>
  );
}
