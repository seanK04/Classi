import express, { Request, Response } from "express";
import mongoose, { Schema, Document } from "mongoose";

const router = express.Router();

// Define TypeScript interfaces
interface ICourse extends Document {
  title: string;
  code: string;
  rank: number;
}

// Define the schema and model
const courseSchema: Schema = new Schema({
  title: { type: String, required: true },
  code: { type: String, required: true },
  rank: { type: Number, required: true },
});

const Course = mongoose.model<ICourse>("Course", courseSchema);

// Helper function to get sorted courses
const getSortedCourses = async (): Promise<ICourse[]> => {
  return await Course.find({}).sort({ rank: 1 }); // Sort courses by rank
};

// Add a course and update ranks
router.post("/api/courses", async (req: Request, res: Response) => {
  const { title, code, rank } = req.body;

  try {
    const existingCourses = await Course.find({});

    // Adjust ranks for all courses below the inserted rank
    for (const course of existingCourses) {
      if (course.rank >= rank) {
        course.rank += 1;
        await course.save();
      }
    }

    // Add the new course
    const newCourse = new Course({ title, code, rank });
    await newCourse.save();

    const sortedCourses = await getSortedCourses();
    res.status(200).json({ message: "Course added and ranked successfully", sortedCourses });
  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({ message: "Failed to add course" });
  }
});

// Get the ranked list of courses
router.get("/api/courses", async (_req: Request, res: Response) => {
  try {
    const sortedCourses = await getSortedCourses();
    res.status(200).json(sortedCourses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
});

export default router;
