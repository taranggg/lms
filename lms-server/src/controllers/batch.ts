import { Request, Response } from "express";
import BatchModel from "../models/batch.js";
import StudentBatchLinkModel from "../models/studentbatchlink.js";

export const createBatch = async (req: Request, res: Response) => {
  try {
    const batch = await BatchModel.create(req.body);
    res.status(201).json(batch);
  } catch (error) {
    res.status(500).json("Batch creation has failed! Please Try Again!");
  }
};

export const getAllBatches = async (req: Request, res: Response) => {
  try {
    const batches = await BatchModel.find();
    res.status(200).json(batches);
  } catch (error) {
    res.status(500).json("Batch retrieval has failed! Please Try Again!");
  }
};

export const getBatchById = async (req: Request, res: Response) => {
  try {
    const batch = await BatchModel.findById(req.params.id);
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

export const getBatchesByFilters = async (req: Request, res: Response) => {
  try {
    const batches = await BatchModel.find({
      branch: req.query.branchId,
      trainer: req.query.trainerId,
      type: req.query.type,
    });
    res.status(200).json(batches);
  } catch (error) {
    res.status(500).json("Batch retrieval has failed! Please Try Again!");
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
