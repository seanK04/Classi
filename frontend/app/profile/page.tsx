import { Share2, CheckCircle, Bookmark, Heart } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-md z-50">
        <div className="flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-blue-700">Khoi Le</h1>
          <button className="text-gray-500 hover:text-blue-700 transition duration-200">
            <Share2 className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Profile Info */}
      <div className="flex flex-col items-center bg-white py-6 shadow-lg rounded-lg mx-4 mt-4">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full border-4 border-blue-300 flex items-center justify-center text-blue-700 text-4xl font-bold">
          KL
        </div>
        <p className="text-blue-800 font-medium mt-2">@leckhoi07</p>
        <p className="text-gray-500 text-sm">Member since February 2025</p>

        {/* Buttons */}
        <div className="mt-4 flex space-x-4">
          <button className="px-4 py-2 border rounded-full text-gray-600 hover:text-black transition duration-200">
            Edit profile
          </button>
          <button className="px-4 py-2 border rounded-full text-gray-600 hover:text-black transition duration-200">
            Share profile
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-around bg-white py-4 shadow-md mt-4 rounded-lg mx-4">
        <div className="text-center">
          <p className="font-bold text-blue-800">2</p>
          <p className="text-sm text-gray-500">Followers</p>
        </div>
        <div className="text-center">
          <p className="font-bold text-blue-800">3</p>
          <p className="text-sm text-gray-500">Following</p>
        </div>
        <div className="text-center">
          <p className="font-bold text-gray-500">-</p>
          <p className="text-sm text-gray-500">Rank on Classi</p>
        </div>
      </div>

      {/* Lists */}
      <div className="mt-4 bg-white py-4 shadow-md rounded-lg mx-4 space-y-2">
        {[
          { icon: <CheckCircle className="w-5 h-5 text-gray-500" />, label: "Rated", count: 0 },
          { icon: <Bookmark className="w-5 h-5 text-gray-500" />, label: "Want to Take", count: 0 },
          { icon: <Heart className="w-5 h-5 text-gray-500" />, label: "Recommended Classes", count: 0 }, // Replaced Lock with 0
        ].map((item, index) => (
          <div key={index} className="flex justify-between items-center px-4">
            <div className="flex items-center space-x-2">
              {item.icon}
              <p className="text-blue-800">{item.label}</p>
            </div>
            <p className="text-gray-500">{item.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

