import Image from "next/image";
import { Bell, Menu } from "lucide-react";

const friendsActivity = [];

export default function Feed() {
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
            {/* Notification Icon */}
            <div className="relative">
              <Bell className="w-6 h-6 text-blue-600 hover:text-blue-800 transition duration-200" />
            </div>

            {/* Menu Icon */}
            <Menu className="w-6 h-6 text-blue-600 hover:text-blue-800 transition duration-200" />
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-blue-100 p-4 shadow-md">
        <input
          type="text"
          placeholder="Search a teacher, class, etc."
          className="w-full px-4 py-3 border border-blue-300 rounded-full focus:outline-none focus:ring focus:ring-blue-400 placeholder:text-gray-500"
        />
      </div>

      {/* Feed Content */}
      <div className="p-6">
        {/* If no activity */}
        {friendsActivity.length === 0 && (
          <div className="text-center bg-white p-6 rounded-lg shadow-md">
            <p className="text-lg text-blue-700 font-semibold">
              Where the action happens!
            </p>
            <p className="text-sm text-blue-500 font-medium">
              Follow friends to see what they've been taking and what classes
              they want to take next.
            </p>
            <button className="mt-4 px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-full transition duration-200 shadow-md">
              Find Friends
            </button>
          </div>
        )}

        {/* Friend Activity Cards */}
        {friendsActivity.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start mb-4 bg-white p-6 rounded-xl shadow-lg transition duration-200 hover:shadow-xl"
          >
            {/* Avatar */}
            <Image
              src={activity.avatar}
              alt={`${activity.name} avatar`}
              width={50}
              height={50}
              className="rounded-full border border-blue-200 shadow-sm"
            />

            {/* Activity Details */}
            <div className="ml-6 flex-grow">
              <p className="font-semibold text-lg text-blue-800">
                {activity.name} ranked{" "}
                <span className="text-blue-600 font-bold">
                  {activity.course}
                </span>
              </p>
              <p className="text-sm text-gray-500">{activity.location}</p>
              <p className="text-xs text-gray-400">{activity.time}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 border border-blue-300 shadow-md">
              <span className="font-bold text-blue-700 text-lg">
                {activity.rating}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
