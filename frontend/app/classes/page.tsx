"use client"
import { Share } from "lucide-react";
import { useEffect, useState } from "react";

interface Course {
  _id: string;
  title: string;
  code: string;
  rank: number;
}

export default function ClassesPage() {
  const [classList, setClassList] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/courses');
        const data = await response.json();
        // Sort by rank in ascending order (1 to n)
        const sortedCourses = data.sort((a: Course, b: Course) => a.rank - b.rank);
        setClassList(sortedCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const exportToCSV = () => {
    const csvContent = [
      ["Rank", "Title", "Code"],
      ...classList.map((item) => [
        item.rank,
        item.title,
        item.code,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = "classes.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-md z-50">
        <div className="flex justify-between items-center px-4 py-3">
          <h1 className="text-xl font-bold text-blue-700">My Classes</h1>
          <div className="flex space-x-4">
            <Share
              className="w-6 h-6 text-blue-600 hover:text-blue-800 transition duration-200 cursor-pointer"
              onClick={exportToCSV}
            />
          </div>
        </div>
      </header>

      {/* Ranked List */}
      <div className="p-6 space-y-4">
        {classList.map((item, index) => (
          <div
            key={item._id}
            className="flex items-start justify-between bg-white p-5 rounded-xl shadow-lg border border-blue-200 hover:shadow-xl transition duration-200"
          >
            <div className="flex-1">
              <p className="font-semibold text-lg text-blue-800">
                {index + 1}. {item.title}
              </p>
              <p className="text-sm text-blue-600">{item.code}</p>
              <p className="text-sm text-gray-500">
                Rank: {item.rank}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
