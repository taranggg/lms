import { Request, Response } from "express";
import AttendanceModel from "../models/attendance.js";
import mongoose from "mongoose";

// Mark Attendance (Upsert: Create or Update)
export const markBatchAttendance = async (req: Request, res: Response) => {
  try {
    const { batchId, date, records, trainerId, trainerStatus } = req.body;
    const { userId, role } = req.user as any; // Assuming Auth Middleware adds this

    // Normalize date to midnight to ensure consistency
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const filter = { batchId, date: attendanceDate };
    const update = {
      batchId,
      date: attendanceDate,
      records,
      trainerId,
      trainerStatus,
      markedBy: userId,
      markedByModel: role === "Admin" ? "Admin" : "Trainer",
    };

    const attendance = await AttendanceModel.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true, // Create if doesn't exist
      setDefaultsOnInsert: true,
    });

    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error marking attendance", error });
  }
};

// Get Attendance for a specific Batch on a specific Date
export const getBatchAttendance = async (req: Request, res: Response) => {
  try {
    const { batchId, date } = req.query;

    if (!batchId || !date) {
      return res
        .status(400)
        .json({ success: false, message: "Missing batchId or date" });
    }

    const attendanceDate = new Date(date as string);
    attendanceDate.setHours(0, 0, 0, 0);

    const attendance = await AttendanceModel.findOne({
      batchId,
      date: attendanceDate,
    }).populate("records.studentId", "name studentId profilePicture");

    if (!attendance) {
      return res.status(200).json({
        success: true,
        data: null,
        message: "No attendance found for this date",
      });
    }

    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching attendance", error });
  }
};

// Get Attendance History for a Student (Optimized with Projection)
export const getStudentAttendance = async (req: Request, res: Response) => {
  try {
    const { studentId, batchId } = req.query;

    if (!studentId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing studentId" });
    }

    const query: any = { "records.studentId": studentId };
    if (batchId) query.batchId = batchId;

    const history = await AttendanceModel.find(query, {
      date: 1,
      batchId: 1,
      trainerId: 1,
      "records.$": 1, // Projection: ONLY return the matching student record
    })
      .sort({ date: -1 })
      .populate("batchId", "title")
      .populate("trainerId", "name");

    // Flatten the response for frontend convenience
    const formattedHistory = history.map((doc) => ({
      _id: doc._id,
      date: doc.date,
      batch: doc.batchId,
      trainer: doc.trainerId,
      status: doc.records[0].status, // Guaranteed to exist due to query
    }));

    res.status(200).json({ success: true, data: formattedHistory });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching student history",
      error,
    });
  }
};
