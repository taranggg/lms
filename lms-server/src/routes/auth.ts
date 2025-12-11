import express from "express";
import { adminGoogleLogin, trainerGoogleLogin } from "../controllers/auth.js";
import { authenticator } from "../middlewares/authenticator.js";

const router = express.Router();

router.post("/admin/signin", adminGoogleLogin);

router.post("/trainer/signin", trainerGoogleLogin);

export default router;
