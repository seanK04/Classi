import Image from "next/image";
import { ChevronDown } from "lucide-react";

export default function LeaderboardPage() {
  const users = [
    {
      id: 1,
      username: "@ArnavGoel",
      avatar: "/arnav_goel.jpg",
      rank: 1,
      classesRanked: 20, // Example number of classes ranked
    },
  ];

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
          <select className="appearance-none w-full px-4 py-2 pr-8 border border-gray-300 rounded-full text-sm text-gray-600 bg-gray-50 cursor-pointer">
            <option>All Members</option>
            <option>Friends</option>
          </select>
          <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="p-6 space-y-4">
        {users.map((user, index) => (
          <div
            key={user.id}
            className="flex items-center justify-between bg-white p-5 rounded-xl shadow-lg border border-blue-200 hover:shadow-xl transition duration-200"
          >
            {/* Rank */}
            <p className="text-lg font-bold text-gray-600 w-8">{user.rank}</p>

            {/* User Info (Moved Left) */}
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
