"use client"

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface User {
  id: number;
  username: string;
  avatar: string;
  rank: number;
  classesRanked: number;
  isFriend: boolean;
}

export default function LeaderboardPage() {
  const allUsers: User[] = [
    {
      id: 1,
      username: "@ArnavGoel",
      avatar: "/arnav_goel.jpg",
      rank: 1,
      classesRanked: 20,
      isFriend: true,
    },
    {
      id: 2,
      username: "@LebronJames",
      avatar: "/lebron_james.jpg",
      rank: 2,
      classesRanked: 18,
      isFriend: false,
    },
    {
      id: 3,
      username: "@JamesHarden",
      avatar: "/james_harden.jpg",
      rank: 3,
      classesRanked: 15,
      isFriend: false,
    },
    {
      id: 4,
      username: "@JessieWang",
      avatar: "/jessie_wang.jpg",
      rank: 4,
      classesRanked: 13,
      isFriend: false,
    },
    {
      id: 5,
      username: "@RahiniGiridharan",
      avatar: "/rahini_g.jpg",
      rank: 5,
      classesRanked: 10,
      isFriend: false,
    },
    {
      id: 6,
      username: "@CharlieDuong",
      avatar: "/charlie_duong.jpg",
      rank: 6,
      classesRanked: 8,
      isFriend: false,
    },
  ];

  const [filter, setFilter] = useState<string>("All Members");
  const filteredUsers = filter === "Friends" ? allUsers.filter((user) => user.isFriend) : allUsers;

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-md z-50">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-blue-700">Leaderboard</h1>
        </div>
      </header>

      {/* Filters */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="relative w-48">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none w-full px-4 py-2 pr-8 border border-gray-300 rounded-full text-sm text-gray-600 bg-gray-50 cursor-pointer"
          >
            <option>All Members</option>
            <option>Friends</option>
          </select>
          <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="p-6 space-y-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between bg-white p-5 rounded-xl shadow-lg border border-blue-200 hover:shadow-xl transition duration-200"
          >
            {/* Rank */}
            <p className="text-lg font-bold text-gray-600 w-8">{user.rank}</p>

            {/* User Info */}
            <div className="flex items-center space-x-3 flex-1">
              <Image
                src={user.avatar}
                alt={`${user.username} avatar`}
                width={50}
                height={50}
                className="rounded-full border border-blue-300 shadow-sm"
              />
              <p className="text-blue-800 font-medium">{user.username}</p>
            </div>

            {/* Classes Ranked */}
            <p className="text-sm text-gray-500">Classes Ranked: {user.classesRanked}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
