"use client"
import React, { useState } from "react";
import { CheckCircle, Bookmark, Heart } from "lucide-react";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("Khoi Le");
  const [usernameHandle, setUsernameHandle] = useState<string>("@leckhoi07");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setProfilePicture(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-blue-50 overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-md z-50 w-full">
        <div className="relative w-full px-4 py-4">
          {/* Center Khoi Le in the header */}
          <h1 className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold text-blue-700">
            {username}
          </h1>
        </div>
      </header>

      {/* Profile Info */}
      <div className="flex flex-col items-center bg-white py-6 shadow-lg rounded-lg mx-4 mt-4">
        {/* Avatar */}
        <div className="relative w-24 h-24 rounded-full border-4 border-blue-300">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-blue-700 text-4xl font-bold">
              KL
            </div>
          )}
        </div>
        <p className="text-blue-800 font-medium mt-2">{usernameHandle}</p>
        <p className="text-gray-500 text-sm">Member since February 2025</p>

        {/* Buttons */}
        <div className="mt-4 flex space-x-4">
          <button
            className="px-4 py-2 border rounded-full text-gray-600 hover:text-black transition duration-200"
            onClick={() => setIsEditing(true)}
          >
            Edit profile
          </button>
          <button className="px-4 py-2 border rounded-full text-gray-600 hover:text-black transition duration-200">
            Share profile
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 overflow-hidden">
            <h2 className="text-lg font-bold text-blue-700 mb-4">Edit Profile</h2>

            {/* Change Username Handle */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Username Handle</label>
              <input
                type="text"
                value={usernameHandle}
                onChange={(e) => setUsernameHandle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-400 text-black"
              />
            </div>

            {/* Upload Profile Picture */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="block w-full text-sm text-gray-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 border rounded-lg text-gray-600 hover:text-black transition duration-200"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

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
          { icon: <CheckCircle className="w-5 h-5 text-gray-500" />, label: "Rated", count: 11 },
          { icon: <Bookmark className="w-5 h-5 text-gray-500" />, label: "Want to Take", count: 3 },
          { icon: <Heart className="w-5 h-5 text-gray-500" />, label: "Recommended Classes", count: 3 },
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


