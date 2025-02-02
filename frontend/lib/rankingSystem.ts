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
    title: "Introduction to Object-Oriented Programming and Computer Science",
    code: "CSCI 0150",
    department: "Computer Science",
    difficulty: 3.5,
    workload: 4.0,
  },
  {
    _id: "sample2",
    title: "Honors Statistical Infernece I",
    code: "APMA 1655",
    department: "Applied Mathematics",
    difficulty: 4.0,
    workload: 4.5,
  },
  {
    _id: "sample3",
    title: "Introduction to Linguistics",
    code: "LING 0100",
    department: "Linguistics",
    difficulty: 3.8,
    workload: 4.2,
  },
  {
    _id: "sample4",
    title: "Equilibrium, Rate, and Structure",
    code: "CHEM 0330",
    department: "Chemistry",
    difficulty: 3.8,
    workload: 4.2,
  },
  {
    _id: "sample5",
    title: "Program Design with Data Structures and Algorithms",
    code: "CSCI 0200",
    department: "Computer Science",
    difficulty: 3.8,
    workload: 4.2,
  },
  {
    _id: "sample6",
    title: "Applied Ordinary Differential Equations",
    code: "APMA 0350",
    department: "Applied Mathematics",
    difficulty: 3.8,
    workload: 4.2,
  },
  {
    _id: "sample7",
    title: "Organic Chemistry I",
    code: "CHEM 0350",
    department: "Chemistry",
    difficulty: 3.8,
    workload: 4.2,
  },
  {
     _id: "sample8",
    title: "Cell and Molecular Biology",
    code: "BIOL 0500",
    department: "Biology",
    difficulty: 3.8,
    workload: 4.2,
  }
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
