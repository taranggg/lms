import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import dotenv from "dotenv";
import path from "path";
// import { fileURLToPath } from "url"; // Removed

import { connectDB } from "./config/db.js";
import branchRouter from "./routes/branch.js";
import trainerRouter from "./routes/trainer.js";
import coursesandtopicsRouter from "./routes/coursesandtopics.js";
import studentRouter from "./routes/student.js";
import batchRouter from "./routes/batch.js";
import materialRouter from "./routes/materials.js";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import authRouter from "./routes/auth.js";

// const __filename = fileURLToPath(import.meta.url); // Removed
// const __dirname = path.dirname(__filename); // Removed

dotenv.config({ path: path.resolve(process.cwd(), "src/config/config.env") });

export const app = express();

connectDB();

// Essential middleware in correct order
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => res.json({ status: "OK" }));

// Swagger UI
// Swagger UI
const swaggerFile = path.join(process.cwd(), "swagger_output.json");
if (fs.existsSync(swaggerFile)) {
  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFile, "utf8"));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

/////Routes
app.use("/auth", authRouter);
app.use("/api/v1/branch", branchRouter);
app.use("/api/v1/trainer", trainerRouter);
app.use("/api/v1/coursesandtopics", coursesandtopicsRouter);
app.use("/api/v1/student", studentRouter);
app.use("/api/v1/batch", batchRouter);
app.use("/api/v1/material", materialRouter);
