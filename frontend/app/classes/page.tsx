"use client";
import { useState } from "react";
import { Share, X } from "lucide-react";
import { getCourse, getRankings } from "../../lib/rankingSystem";

export default function ClassesPage() {
  const rankings = getRankings();
  const totalRanks = rankings.length;

  const [selectedClass, setSelectedClass] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("personal"); // "personal" or "global"
  const [personalComments, setPersonalComments] = useState([]);
  const [globalComments, setGlobalComments] = useState([
    {
      id: 1,
      name: "Khoi Le",
      avatar: "/avatar-placeholder.png",
      comment: "This class was very engaging!",
      time: "1 hour ago",
    },
    {
      id: 2,
      name: "Anna Smith",
      avatar: "/avatar-placeholder.png",
      comment: "The professor explained everything clearly.",
      time: "2 hours ago",
    },
  ]);
  const [newComment, setNewComment] = useState("");

  const classList = rankings.map((courseId, index) => {
    const course = getCourse(courseId);
    const rank = index + 1;

    // Linear normalization formula
    const score = 10 - ((rank - 1) / (totalRanks - 1)) * 9;

    return {
      id: course?._id,
      name: course?.title,
      department: course?.department,
      difficulty: `${course?.difficulty.toFixed(1)}/5.0`,
      status: "Open",
      courseCode: course?.code,
      rank,
      score,
    };
  });

  const exportToCSV = () => {
    const csvContent = [
      ["ID", "Name", "Department", "Difficulty", "Status", "Course Time", "Score"],
      ...classList.map((item) => [
        item.id,
        item.name,
        item.department,
        item.difficulty,
        item.status,
        item.courseCode,
        item.score.toFixed(2),
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

  const getBubbleColor = (score: number) => {
    if (score >= 7) return "bg-green-600 bg-opacity-30";
    if (score >= 4) return "bg-yellow-500 bg-opacity-30";
    return "bg-red-600 bg-opacity-30";
  };

  const openModal = (classItem) => {
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
        {classList.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-white p-5 rounded-xl shadow-lg border border-blue-200 hover:shadow-xl transition duration-200 cursor-pointer"
            onClick={() => openModal(item)}
          >
            {/* Class Details */}
            <div className="flex-1">
              <p className="font-semibold text-lg text-blue-800">
                {item.rank}. {item.name}
              </p>
              <p className="text-sm text-blue-600">{item.department}</p>
              <p className="text-sm text-gray-500">
                Difficulty: {item.difficulty}
              </p>
              <p className="text-sm text-gray-500">
                Course Code: {item.courseCode}
              </p>
            </div>

            {/* Normalized Score */}
            <div
              className={`flex items-center justify-center w-14 h-14 rounded-full text-black font-bold text-lg shadow-md ${getBubbleColor(
                item.score
              )}`}
            >
              {item.score.toFixed(1)}
            </div>
          </div>
        ))}
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
              {selectedClass.name}
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
                      <p className="font-semibold">{comment.name}</p>
                      <p className="text-sm text-gray-600">{comment.comment}</p>
                      <p className="text-xs text-gray-400">{comment.time}</p>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Add Comment */}
            <div className="mt-4">
              <textarea
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
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
