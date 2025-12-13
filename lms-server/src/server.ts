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

app.listen(port, () => {
  console.log("Server is running");
});
