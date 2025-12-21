import express from "express";
import {
  adminGoogleLogin,
  trainerGoogleLogin,
  studentLogin,
  updateStudentPassword,
  verifyToken,
} from "../controllers/auth.js";

const authRouter = express.Router();

authRouter.post("/admin/signin", adminGoogleLogin);

authRouter.post("/trainer/signin", trainerGoogleLogin);

authRouter.post("/student/login", studentLogin);

authRouter.post("/student/update-password", updateStudentPassword);

authRouter.post("/verify-token", verifyToken);

export default authRouter;
