// 'use client';

// import { useState, useEffect } from 'react';

// interface Course {
//   _id: string;
//   title: string;
//   code: string;
//   rank: number;
// }

// // Custom hook for ranking logic
// function useRankingLogic(onComplete: (rank: number) => void) {
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [currentIndex, setCurrentIndex] = useState<number>(0);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         const response = await fetch('http://localhost:3001/api/courses');
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const fetchedCourses = await response.json();
//         console.log('🔄 Fetched courses:', fetchedCourses);
        
//         // Sort by rank descending (highest rank first)
//         const sortedCourses = [...fetchedCourses].sort((a, b) => b.rank - a.rank);
//         console.log('📊 Sorted courses:', sortedCourses);
        
//         setCourses(sortedCourses);
        
//         if (sortedCourses.length === 0) {
//           console.log('📝 No existing courses, assigning rank 0');
//           onComplete(0);
//         }
        
//         setLoading(false);
//       } catch (error) {
//         console.error('❌ Failed to fetch courses:', error);
//         setLoading(false);
//       }
//     };
//     fetchCourses();
//   }, [onComplete]);

//   const handlePreference = (preferNew: boolean) => {
//     console.log('👆 Preference:', preferNew ? 'New Course' : 'Existing Course', 'at index:', currentIndex);
    
//     if (preferNew) {
//       // If we prefer the new course, it should go above the current course
//       const newRank = courses[currentIndex].rank + 1;
//       console.log('✅ Placing above current course with rank:', newRank);
//       onComplete(newRank);
//     } else {
//       // If we prefer the existing course, move to next course or finish
//       if (currentIndex === courses.length - 1) {
//         // We've reached the end, place at bottom
//         console.log('✅ Reached end, placing at bottom with rank 0');
//         onComplete(0);
//       } else {
//         // Move to next course
//         setCurrentIndex(currentIndex + 1);
//         console.log('➡️ Moving to next course at index:', currentIndex + 1);
//       }
//     }
//   };

//   return {
//     loading,
//     currentCourse: courses[currentIndex] || null,
//     handlePreference
//   };
// }

// interface RankCoursePromptProps {
//   newCourse: { title: string; code: string };
//   onComplete: (rank: number) => void;
//   onCancel: () => void;
// }

// // UI Component
// export default function RankCoursePrompt({ newCourse, onComplete, onCancel }: RankCoursePromptProps) {
//   const { loading, currentCourse, handlePreference } = useRankingLogic(onComplete);

//   if (loading) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//         <div className="bg-white p-6 rounded-lg shadow-lg">
//           <p>Loading courses...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!currentCourse) {
//     return null;
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//       <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
//         <h2 className="text-xl text-black font-bold mb-4">Which course do you prefer?</h2>
        
//         <div className="grid grid-cols-2 gap-4">
//           {/* New Course Button */}
//           <button
//             onClick={() => handlePreference(true)}
//             className="p-4 border rounded hover:bg-gray-50 transition-colors"
//           >
//             <h3 className="font-bold text-black">{newCourse.title}</h3>
//             <p className="text-sm text-gray-600">{newCourse.code}</p>
//           </button>

//           {/* Comparison Course Button */}
//           <button
//             onClick={() => handlePreference(false)}
//             className="p-4 border rounded hover:bg-gray-50 transition-colors"
//           >
//             <h3 className="font-bold text-black">{currentCourse.title}</h3>
//             <p className="text-sm text-gray-600">{currentCourse.code}</p>
//           </button>
//         </div>

//         <button 
//           onClick={onCancel}
//           className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";

interface Course {
  id: string;
  title: string;
  code: string;
}

const fetchCourses = async (): Promise<Course[]> => {
  const response = await fetch("/api/courses");
  return response.json();
};

const RankCoursePrompt = ({ newCourse, onCancel }: { newCourse: Course, onCancel: () => void }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [insertionIndex, setInsertionIndex] = useState(0);
  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    fetchCourses().then((data) => {
      setCourses(data);
      setHigh(data.length);
    });
  }, []);

  const handlePreference = (preferNew: boolean) => {
    if (preferNew) {
      setHigh(currentIndex);
    } else {
      setLow(currentIndex + 1);
    }

    const mid = Math.floor((low + high) / 2);
    if (low < high) {
      setCurrentIndex(mid);
    } else {
      setInsertionIndex(low);
      setFinished(true);
    }
  };

  const finalizeRanking = () => {
    const updatedCourses = [...courses];
    updatedCourses.splice(insertionIndex, 0, newCourse);
    setCourses(updatedCourses);
  };

  if (!courses.length) return <p>Loading courses...</p>;
  if (finished)
    return (
      <div>
        <p>{`New course will be ranked at position ${insertionIndex + 1}`}</p>
        <button onClick={finalizeRanking} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Confirm</button>
      </div>
    );

  const currentCourse = courses[currentIndex];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl text-black font-bold mb-4">Which course do you prefer?</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handlePreference(true)}
            className="p-4 border rounded hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-bold text-black">{newCourse.title}</h3>
            <p className="text-sm text-gray-600">{newCourse.code}</p>
          </button>

          <button
            onClick={() => handlePreference(false)}
            className="p-4 border rounded hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-bold text-black">{currentCourse.title}</h3>
            <p className="text-sm text-gray-600">{currentCourse.code}</p>
          </button>
        </div>

        <button 
          onClick={onCancel}
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RankCoursePrompt;