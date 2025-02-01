import { Search, MapPin, Plus, Bookmark, X } from "lucide-react";

export default function SearchPage() {
  const classResults = [
    {
      id: 1,
      name: "CSCI0150 || Intro to Object Oriented Programming",
      time: "10:00am - 10:50am",
    },
  ];

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
            placeholder="Search for a class, professor, or topic"
            className="w-full bg-transparent outline-none text-gray-700"
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-gray-500">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-gray-400" />
            <p className="text-sm">Brown University</p> {/* ✅ Changed text here */}
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
        {classResults.map((result) => (
          <div
            key={result.id}
            className="flex items-center justify-between bg-white p-5 rounded-xl shadow-lg border border-blue-200 hover:shadow-xl transition duration-200"
          >
            <div>
              <p className="font-semibold text-lg text-blue-800">{result.name}</p>
              <p className="text-sm text-gray-500">{result.time}</p> {/* Fixed undefined location */}
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
        ))}
      </div>
    </div>
  );
}
