import express from "express";
import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from "../controllers/student.js";
import { adminAuthenticator } from "../middlewares/adminAuthenticator.js";

const studentRouter = express.Router();

studentRouter.post("/createStudent", adminAuthenticator, createStudent);
studentRouter.get("/getAllStudents", adminAuthenticator, getAllStudents);
studentRouter.get("/getStudentById/:id", adminAuthenticator, getStudentById);
studentRouter.put("/updateStudent/:id", adminAuthenticator, updateStudent);
studentRouter.delete("/deleteStudent/:id", adminAuthenticator, deleteStudent);

export default studentRouter;
