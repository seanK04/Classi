"use client"; // Ensure client-side rendering for interactivity

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Bell, Menu, Heart, Bookmark, PlusCircle } from "lucide-react";

interface Activity {
  id: number;
  user: string;
  action: string;
  course: string;
  rating: number;
  timestamp: string;
  location: string;
}

interface Comment {
  activityId: number;
  user: string;
  text: string;
  likes: number;
  liked: boolean;
}

export default function Feed() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  const activities: Activity[] = [
    {
      id: 1,
      user: "Arnav Goel",
      action: "ranked",
      course: "Introduction to Philosophy",
      rating: 4.7,
      timestamp: "7 hours ago",
      location: "Brown University, Providence, RI",
    },
    {
      id: 2,
      user: "Arnav Goel",
      action: "ranked",
      course: "Data Structures and Algorithms",
      rating: 8.6,
      timestamp: "7 hours ago",
      location: "MIT, Cambridge, MA",
    },
    {
      id: 3,
      user: "Arnav Goel",
      action: "ranked",
      course: "Advanced Calculus",
      rating: 10.0,
      timestamp: "7 hours ago",
      location: "Harvard University, Cambridge, MA",
    },
  ];

  // Load comments from localStorage on component mount
  useEffect(() => {
    const savedComments = localStorage.getItem("comments");
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, []);

  // Save comments to localStorage whenever they are updated
  useEffect(() => {
    localStorage.setItem("comments", JSON.stringify(comments));
  }, [comments]);

  const toggleButtonState = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    colorClass: string
  ): void => {
    e.currentTarget.classList.toggle(colorClass);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = activities.filter(
      (activity) =>
        activity.user.toLowerCase().includes(query) ||
        activity.course.toLowerCase().includes(query)
    );
    setFilteredActivities(filtered);
  };

  const handleAddComment = (activityId: number, text: string): void => {
    const newComment: Comment = {
      activityId,
      user: "Khoi Le",
      text,
      likes: 0,
      liked: false,
    };
    setComments((prev) => [...prev, newComment]);
  };

  const toggleCommentLike = (index: number): void => {
    setComments((prev) =>
      prev.map((comment, i) =>
        i === index
          ? {
              ...comment,
              likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
              liked: !comment.liked,
            }
          : comment
      )
    );
  };

  const displayedActivities: Activity[] = searchQuery ? filteredActivities : activities;

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 bg-white shadow-lg z-50">
        <div className="flex justify-between items-center px-4 py-3">
          {/* Logo */}
          <div className="flex items-center">
            <Image src="/logo.png" alt="Classi Logo" width={80} height={30} />
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Bell className="w-6 h-6 text-blue-600 hover:text-blue-800 transition duration-200" />
            </div>
            <Menu className="w-6 h-6 text-blue-600 hover:text-blue-800 transition duration-200" />
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-blue-100 p-4 shadow-md">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search a teacher, class, etc."
          className="w-full px-4 py-3 border border-blue-300 rounded-full focus:outline-none focus:ring focus:ring-blue-400 placeholder:text-gray-500"
        />
      </div>

      {/* Feed Content */}
      <div className="p-6 space-y-4">
        {displayedActivities.map((activity) => (
          <div
            key={activity.id}
            className="p-4 bg-white rounded-lg shadow-md flex flex-col space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900 font-medium">
                  {activity.user}{" "}
                  <span className="text-gray-500">{activity.action}</span>{" "}
                  <span className="font-semibold">{activity.course}</span>
                </p>
                <p className="text-sm text-gray-500">{activity.location}</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-green-600">
                  {activity.rating}
                </p>
                <p className="text-xs text-gray-400">{activity.timestamp}</p>
              </div>
            </div>

            {/* Comments */}
            <div className="mt-4 space-y-4">
              {comments
                .filter((comment) => comment.activityId === activity.id)
                .map((comment, index) => (
                  <div key={index} className="p-3 bg-gray-100 rounded-lg">
                    <p className="text-sm font-semibold text-blue-700">{comment.user}</p>
                    <p className="text-sm text-gray-700">{comment.text}</p>
                    <div
                      className="flex items-center space-x-2 mt-2 text-gray-500 cursor-pointer"
                      onClick={() => toggleCommentLike(index)}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          comment.liked ? "text-red-500" : ""
                        }`}
                      />
                      <span className="text-xs">{comment.likes} Likes</span>
                    </div>
                  </div>
                ))}

              {/* Add Comment */}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-blue-400 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      handleAddComment(activity.id, e.currentTarget.value.trim());
                      e.currentTarget.value = "";
                    }
                  }}
                />
              </div>
            </div>

            {/* Button Layout */}
            <div className="flex items-center space-x-6 text-gray-500 mt-4">
              {/* Like Button */}
              <div
                className="flex items-center space-x-1 cursor-pointer"
                onClick={(e) => toggleButtonState(e, "text-red-500")}
              >
                <Heart className="w-5 h-5 transition duration-200" />
                <span className="text-sm">Like</span>
              </div>

              {/* Save Button */}
              <div
                className="flex items-center space-x-1 cursor-pointer"
                onClick={(e) => toggleButtonState(e, "text-blue-500")}
              >
                <Bookmark className="w-5 h-5 transition duration-200" />
                <span className="text-sm">Save</span>
              </div>

              {/* Add Button */}
              <div className="flex items-center space-x-1 cursor-pointer">
                <PlusCircle className="w-5 h-5 hover:text-blue-500 transition duration-200" />
                <span className="text-sm">Add</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
