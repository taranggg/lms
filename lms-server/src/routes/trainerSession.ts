import express from "express";
import {
  startSession,
  heartbeat,
  endSession,
  getTrainerSessionHistory,
} from "../controllers/trainerSession.js";
import { admintrainerAuthenticator } from "../middlewares/admintrainerAuthenticator.js";

const trainerSessionRouter = express.Router();

// Apply authenticator
trainerSessionRouter.use(admintrainerAuthenticator);

trainerSessionRouter.post("/startSession", startSession);
trainerSessionRouter.post("/heartbeat", heartbeat);
trainerSessionRouter.post("/endSession", endSession);
trainerSessionRouter.get("/getTrainerSessionHistory", getTrainerSessionHistory);

export default trainerSessionRouter;
