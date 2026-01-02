import express from "express";
import {
  markBatchAttendance,
  getBatchAttendance,
  getStudentAttendance,
} from "../controllers/attendance.js";
import { admintrainerAuthenticator } from "../middlewares/admintrainerAuthenticator.js";

const attendanceRouter = express.Router();

// Apply authenticator to all routes
attendanceRouter.use(admintrainerAuthenticator);

attendanceRouter.post("/markBatchAttendance", markBatchAttendance);
attendanceRouter.get("/getBatchAttendance", getBatchAttendance);
attendanceRouter.get("/getStudentAttendance", getStudentAttendance);

export default attendanceRouter;
