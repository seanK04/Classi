"use client";
import { Share, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Course {
  _id: string;
  title: string;
  code: string;
  rank: number;
}

interface Comment {
  id: number;
  name: string;
  avatar: string;
  comment: string;
  time: string;
}

export default function ClassesPage() {
  const [classList, setClassList] = useState<Course[]>([]);
  const [selectedClass, setSelectedClass] = useState<Course | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"personal" | "global">("personal");
  const [personalComments, setPersonalComments] = useState<Comment[]>([]);
  const [globalComments, setGlobalComments] = useState<Comment[]>([
    {
      id: 1,
      name: "Jessie Wang",
      avatar: "/jessie_wang.jpg",
      comment: "This class was very engaging!",
      time: "1 hour ago",
    },
    {
      id: 2,
      name: "Charlie Duong",
      avatar: "/charlie_duong.jpg",
      comment: "I wanna drop out.",
      time: "2 hours ago",
    },
  ]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/courses");
        const data = await response.json();
        // Sort by rank in ascending order
        const sortedCourses = data.sort((a: Course, b: Course) => a.rank - b.rank);
        setClassList(sortedCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const exportToCSV = () => {
    const csvContent = [
      ["Rank", "Title", "Code"],
      ...classList.map((item) => [item.rank, item.title, item.code]),
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

  const getBubbleColor = (score: number) => {
    if (score >= 7) return "bg-green-600 bg-opacity-30";
    if (score >= 4) return "bg-yellow-500 bg-opacity-30";
    return "bg-red-600 bg-opacity-30";
  };

  const openModal = (classItem: Course) => {
    setSelectedClass(classItem);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedClass(null);
    setShowModal(false);
    setActiveTab("personal");
    setNewComment("");
  };

  const addComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      name: "You",
      avatar: "/avatar-placeholder.png",
      comment: newComment,
      time: "Just now",
    };

    if (activeTab === "personal") {
      setPersonalComments((prev) => [...prev, comment]);
    } else if (activeTab === "global") {
      setGlobalComments((prev) => [...prev, comment]);
    }

    setNewComment("");
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
        {classList.map((item) => {
          const score = 10 - ((item.rank - 1) / (classList.length - 1)) * 9;
          return (
            <div
              key={item._id}
              className="flex items-center justify-between bg-white p-5 rounded-xl shadow-lg border border-blue-200 hover:shadow-xl transition duration-200 cursor-pointer"
              onClick={() => openModal(item)}
            >
              {/* Class Details */}
              <div className="flex-1">
                <p className="font-semibold text-lg text-blue-800">
                  {item.rank}. {item.title}
                </p>
                <p className="text-sm text-blue-600">{item.code}</p>
                <p className="text-sm text-gray-500">Rank: {item.rank}</p>
              </div>

              {/* Normalized Score */}
              <div
                className={`flex items-center justify-center w-14 h-14 rounded-full text-black font-bold text-lg shadow-md ${getBubbleColor(
                  score
                )}`}
              >
                {score.toFixed(1)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 max-w-2xl p-6 rounded-lg shadow-lg relative">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
              onClick={closeModal}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Class Info */}
            <h2 className="text-xl font-bold text-blue-700 mb-4">
              {selectedClass.title}
            </h2>

            {/* Tabs */}
            <div className="flex space-x-4 mb-4">
              <button
                className={`px-4 py-2 rounded-lg ${
                  activeTab === "personal"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setActiveTab("personal")}
              >
                Personal Notes
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${
                  activeTab === "global"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setActiveTab("global")}
              >
                Global Discussion
              </button>
            </div>

            {/* Comments Section */}
            <div className="space-y-4">
              {(activeTab === "personal" ? personalComments : globalComments).map(
                (comment) => (
                  <div
                    key={comment.id}
                    className="flex items-start space-x-4 bg-gray-100 p-4 rounded-lg shadow-sm"
                  >
                    <img
                      src={comment.avatar}
                      alt={`${comment.name}'s avatar`}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-black">{comment.name}</p>
                      <p className="text-sm text-black">{comment.comment}</p>
                      <p className="text-xs text-gray-400">{comment.time}</p>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Add Comment */}
            <div className="mt-4">
              <textarea
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400 text-black"
                placeholder="Add your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={addComment}
              >
                Post Comment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
