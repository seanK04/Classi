"use client"; // Ensure client-side navigation

import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Welcome to Classi</h1>
      <button
        onClick={() => router.push("/feed")} // ✅ Corrected for App Router
        className="px-6 py-3 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition duration-200"
      >
        Click to Start
      </button>
    </div>
  );
}
