import { Share, Settings } from "lucide-react";

export default function ClassesPage() {
  const classList = [
    {
      id: 1,
      name: "Introduction to Object Oriented Programming",
      department: "Computer Science",
      difficulty: "3.6/5.0",
      status: "Open",
      courseTime: "10:00am - 10:50am",
    },
  ];

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-md z-50">
        <div className="flex justify-between items-center px-4 py-3">
          <h1 className="text-xl font-bold text-blue-700">My Classes</h1>
          <div className="flex space-x-4">
            <Share className="w-6 h-6 text-blue-600 hover:text-blue-800 transition duration-200 cursor-pointer" />
            <Settings className="w-6 h-6 text-blue-600 hover:text-blue-800 transition duration-200 cursor-pointer" />
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex space-x-4 px-4 py-2 bg-blue-100 border-b border-blue-200">
        {["Enrolled", "Wishlist", "Past Classes"].map((tab) => (
          <button
            key={tab}
            className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-200 transition duration-200"
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Ranked List */}
      <div className="p-6 space-y-4">
        {classList.map((item, index) => (
          <div
            key={item.id}
            className="flex items-start justify-between bg-white p-5 rounded-xl shadow-lg border border-blue-200 hover:shadow-xl transition duration-200"
          >
            <div className="flex-1">
              <p className="font-semibold text-lg text-blue-800">
                {index + 1}. {item.name}
              </p>
              <p className="text-sm text-blue-600">{item.department}</p>
              <p className="text-sm text-gray-500">
                Difficulty: {item.difficulty}
              </p>
              <p className="text-sm text-gray-500">
                Status: {item.status} • Time: {item.courseTime}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
