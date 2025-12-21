import express from "express";
import { adminGoogleLogin, trainerGoogleLogin } from "../controllers/auth.js";

const authRouter = express.Router();

authRouter.post("/admin/signin", adminGoogleLogin);

authRouter.post("/trainer/signin", trainerGoogleLogin);

export default authRouter;
