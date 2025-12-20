import mongoose from "mongoose";

export interface Student extends mongoose.Document {
  name: string;
  studentId: string;
  branch: mongoose.Types.ObjectId;
  mobileNumber: string;
  profilePicture: string;
  type: "Weekdays" | "Weekends";
}

const studentSchema = new mongoose.Schema<Student>({
  name: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
    unique: true,
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
  },
  profilePicture: {
    type: String,
  },
  type: {
    type: String,
    enum: ["Weekdays", "Weekends"],
    required: true,
  },
});

const StudentModel = mongoose.model("Student", studentSchema);

export default StudentModel;
