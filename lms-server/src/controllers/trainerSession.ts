import { Request, Response } from "express";
import TrainerSessionModel from "../models/trainerSession.js";
import mongoose from "mongoose";

// Start Session (Login)
export const startSession = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user as any; // Trainer ID from Auth
    const ipAddress = req.ip || req.socket.remoteAddress;
    const device = req.headers["user-agent"];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const newSession = await TrainerSessionModel.create({
      trainerId: userId,
      date: today,
      startTime: new Date(),
      lastActiveAt: new Date(),
      status: "Active",
      ipAddress,
      device,
    });

    res.status(201).json({ success: true, sessionId: newSession._id });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error starting session", error });
  }
};

// Heartbeat (Ping)
export const heartbeat = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing sessionId" });
    }

    const now = new Date();

    const session = await TrainerSessionModel.findByIdAndUpdate(
      sessionId,
      {
        lastActiveAt: now,
        // Optional: Update duration on the fly if needed, but easier to calc at end
      },
      { new: true }
    );

    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error processing heartbeat", error });
  }
};

// End Session (Logout)
export const endSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing sessionId" });
    }

    const session = await TrainerSessionModel.findById(sessionId);
    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    const now = new Date();
    const duration = now.getTime() - session.startTime.getTime();

    session.endTime = now;
    session.lastActiveAt = now;
    session.status = "Completed";
    session.duration = duration;

    await session.save();

    res.status(200).json({ success: true, duration });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error ending session", error });
  }
};

// Get Trainer History
export const getTrainerSessionHistory = async (req: Request, res: Response) => {
  try {
    const { trainerId, startDate, endDate } = req.query;

    const query: any = {};

    if (trainerId) query.trainerId = trainerId;
    //@ts-ignore
    else if (req.user?.role === "Trainer") query.trainerId = req.user.userId;

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    const history = await TrainerSessionModel.find(query).sort({
      startTime: -1,
    });

    res.status(200).json({ success: true, data: history });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching history", error });
  }
};
