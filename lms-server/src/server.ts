import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import adminAuth from "./routes/auth.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { connectDB } from "./config/db.js";
import branchRouter from "./routes/branch.js";
import trainerRouter from "./routes/trainer.js";
import coursesandtopicsRouter from "./routes/coursesandtopics.js";
import studentRouter from "./routes/student.js";
import batchRouter from "./routes/batch.js";
dotenv.config({ path: path.resolve(__dirname, "config", "config.env") });
const port = process.env.PORT || 8000;
const app = express();
connectDB();
// Essential middleware in correct order
app.use(helmet()); // Helmet disabled for testing as per user request
app.use(compression()); // Compression second
app.use(cors()); // CORS
app.use(morgan("combined")); // Logging
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
// Health check
app.get("/health", (req, res) => res.json({ status: "OK" }));
/////Routes
app.use("/auth", adminAuth);
app.use("/api/v1/branch", branchRouter);
app.use("/api/v1/trainer", trainerRouter);
app.use("/api/v1/coursesandtopics", coursesandtopicsRouter);
app.use("/api/v1/student", studentRouter);
app.use("/api/v1/batch", batchRouter);
app.listen(port, () => {
  console.log("Server is running");
});
