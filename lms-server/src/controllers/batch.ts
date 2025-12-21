import { Request, Response } from "express";
import BatchModel from "../models/batch.js";
import StudentBatchLinkModel from "../models/studentbatchlink.js";
import TrainerModel from "../models/trainer.js";
import { google } from "googleapis";
import { v4 as uuidv4 } from "uuid";

export const createBatch = async (req: Request, res: Response) => {
  try {
    const {
      title,
      branch,
      trainer,
      startDate,
      startTime,
      endTime,
      status,
      currentTopic,
      type,
    } = req.body;

    const trainerData = await TrainerModel.findById(trainer).select(
      "+googleRefreshToken"
    );

    let googleMeetLink = "";

    if (trainerData?.googleRefreshToken) {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
      );

      oauth2Client.setCredentials({
        refresh_token: trainerData.googleRefreshToken,
      });

      const calendar = google.calendar({ version: "v3", auth: oauth2Client });

      const eventStartTime = new Date(`${startDate}T${startTime}:00`);
      const eventEndTime = new Date(`${startDate}T${endTime}:00`);

      const event = {
        summary: title,
        description: `Batch: ${title}`,
        start: {
          dateTime: eventStartTime.toISOString(),
          timeZone: "Asia/Kolkata",
        },
        end: {
          dateTime: eventEndTime.toISOString(),
          timeZone: "Asia/Kolkata",
        },
        conferenceData: {
          createRequest: {
            requestId: uuidv4(),
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      };

      try {
        const response = await calendar.events.insert({
          calendarId: "primary",
          requestBody: event,
          conferenceDataVersion: 1,
        });

        googleMeetLink = response.data.hangoutLink || "";
      } catch (calendarError) {
        console.error("Error creating Google Meet link:", calendarError);
        // Continue without link if fails, or handle as needed
      }
    }

    const batch = await BatchModel.create({
      ...req.body,
      googleMeetLink,
    });
    res.status(201).json(batch);
  } catch (error) {
    console.error(error);
    res.status(500).json("Batch creation has failed! Please Try Again!");
  }
};

export const getAllBatches = async (req: Request, res: Response) => {
  try {
    const { branch, trainer, status, type, page = 1, limit = 10 } = req.query;

    const query: any = {};
    if (branch) query.branch = branch;
    if (trainer) query.trainer = trainer;
    if (status) query.status = status;
    if (type) query.type = type;

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;

    const batches = await BatchModel.find(query)
      .skip(skip)
      .limit(limitNumber)
      .populate("branch")
      .populate("trainer");

    const total = await BatchModel.countDocuments(query);

    res.status(200).json({
      data: batches,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
    });
  } catch (error) {
    res.status(500).json("Batch retrieval has failed! Please Try Again!");
  }
};

export const getBatchById = async (req: Request, res: Response) => {
  try {
    const batch = await BatchModel.findById(req.params.id)
      .populate("branch")
      .populate("trainer");
    if (!batch) {
      return res.status(404).json("Batch not found!");
    }
    res.status(200).json(batch);
  } catch (error) {
    res.status(500).json("Batch retrieval has failed! Please Try Again!");
  }
};

export const updateBatch = async (req: Request, res: Response) => {
  try {
    const batch = await BatchModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!batch) {
      return res.status(404).json("Batch not found!");
    }
    res.status(200).json(batch);
  } catch (error) {
    res.status(500).json("Batch update has failed! Please Try Again!");
  }
};

export const deleteBatch = async (req: Request, res: Response) => {
  try {
    const batch = await BatchModel.findByIdAndDelete(req.params.id);
    if (!batch) {
      return res.status(404).json("Batch not found!");
    }
    res.status(200).json(batch);
  } catch (error) {
    res.status(500).json("Batch deletion has failed! Please Try Again!");
  }
};

export const assignBatchToStudent = async (req: Request, res: Response) => {
  try {
    const { batchId, studentId } = req.body;

    if (!batchId || !studentId) {
      res.status(400).json({
        error: "Invalid input. batchId and studentId are required.",
      });
      return;
    }

    await StudentBatchLinkModel.create({
      batch: batchId,
      student: studentId,
    });

    res.status(201).send("Batch assigned to student successfully");
  } catch (error) {
    console.error("Error assigning batch to student:", error);
    res.status(500).json({ error: "Failed To Assign Batch To Student" });
  }
};
