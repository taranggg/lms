import mongoose from "mongoose";

export interface Course extends mongoose.Document {
  name: string;
  description: string;
  image: string;
  type: "Regular" | "Custom";
}

const courseSchema = new mongoose.Schema<Course>({
  name: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["Regular", "Custom"],
  },
});

const Course = mongoose.model("Course", courseSchema);

export default Course;
