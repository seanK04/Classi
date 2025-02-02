interface Course {
  _id: string;
  title: string;
  code: string;
  department: string;
  difficulty: number;
  workload: number;
}

// Sample courses for testing
const sampleCourses: Course[] = [
  {
    _id: "sample1",
    title: "Introduction to Computer Science",
    code: "CS101",
    department: "Computer Science",
    difficulty: 3.5,
    workload: 4.0,
  },
  {
    _id: "sample2",
    title: "Calculus I",
    code: "MATH101",
    department: "Mathematics",
    difficulty: 4.0,
    workload: 4.5,
  },
  {
    _id: "sample3",
    title: "Physics for Engineers",
    code: "PHYS101",
    department: "Physics",
    difficulty: 3.8,
    workload: 4.2,
  },
];

// Global state to store rankings and courses
let courseRankings: string[] = sampleCourses.map(course => course._id);
let coursesMap: { [key: string]: Course } = {};

// Initialize coursesMap with sample courses
sampleCourses.forEach(course => {
  coursesMap[course._id] = course;
});

// Function to get the current rankings
export const getRankings = () => courseRankings;

// Function to get a course by ID
export const getCourse = (courseId: string): Course | undefined => {
  return coursesMap[courseId];
};

// Binary search to find the insertion position
export const findInsertionPosition = (
  left: number,
  right: number
): { position: number; courseToCompare: Course | null; isComplete: boolean } => {
  // For empty list, insert at beginning
  if (courseRankings.length === 0) {
    return { position: 0, courseToCompare: null, isComplete: true };
  }

  // If we've narrowed down to a single position
  if (left >= right) {
    return { position: left, courseToCompare: null, isComplete: true };
  }

  // Calculate middle position
  const position = Math.floor((left + right) / 2);
  
  // Get the course at this position for comparison
  const courseId = courseRankings[position];
  const courseToCompare = coursesMap[courseId];
  
  if (!courseToCompare) {
    console.error('Could not find course to compare against at position:', position);
    return { position: courseRankings.length, courseToCompare: null, isComplete: true };
  }

  // Return the course at the middle position for comparison
  return { position, courseToCompare, isComplete: false };
};

// Insert a course at the specified position
export const insertCourse = (course: Course, position: number) => {
  coursesMap[course._id] = course;
  courseRankings.splice(position, 0, course._id);
};

// Get the current size of rankings
export const getRankingsSize = () => courseRankings.length;

// Clear all rankings (useful for testing)
export const clearRankings = () => {
  courseRankings = [];
};
