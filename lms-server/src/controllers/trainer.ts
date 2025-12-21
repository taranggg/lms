import { Request, Response } from "express";
import TrainerModel from "../models/trainer.js";
import EmailModel from "../models/email.js";
import fs from "fs";

export async function createTrainer(req: Request, res: Response) {
  try {
    const { name, email, branch, domain, mobileNumber, designation, gender } =
      req.body;
    const profilePicture = req.file ? req.file.filename : undefined;
    const addedEmail = await EmailModel.create({
      role: "Trainer",
      email,
    });
    const trainer = await TrainerModel.create({
      name,
      email: addedEmail._id,
      branch,
      domain,
      mobileNumber,
      designation,
      gender,
      profilePicture,
    });

    res.status(201).json(trainer);
  } catch (error) {
    console.error(error);
    if (req.file) {
      fs.unlinkSync(
        `${process.cwd()}/assets/profilePicture/${req.file.filename as string}`
      );
    }
    res.status(500).json({ error: "Failed to create trainer" });
  }
}

export async function getAllTrainers(req: Request, res: Response) {
  try {
    const { branch, domain, page = 1, limit = 10 } = req.query;

    const query: any = {};
    if (branch) query.branch = branch;
    if (domain) query.domain = domain;

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;

    const trainers = await TrainerModel.find(query)
      .skip(skip)
      .limit(limitNumber)
      .populate("branch")
      .populate("domain");

    const total = await TrainerModel.countDocuments(query);

    res.status(200).json({
      data: trainers,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get trainers" });
  }
}

export async function getTrainerById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const trainer = await TrainerModel.findById(id)
      .populate("branch")
      .populate("domain");
    if (!trainer) {
      return res.status(404).json({ error: "Trainer not found" });
    }
    res.status(200).json(trainer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get trainer" });
  }
}

export async function updateTrainer(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (req.file) {
      updateData.profilePicture = req.file.filename;
    }
    const trainer = await TrainerModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    await EmailModel.findByIdAndUpdate(trainer?.email, req.body);
    if (!trainer) {
      return res.status(404).json({ error: "Trainer not found" });
    }
    res.status(200).json(trainer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update trainer" });
  }
}

export async function deleteTrainer(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const trainer = await TrainerModel.findByIdAndDelete(id);
    await EmailModel.findByIdAndDelete(trainer?.email);
    if (!trainer) {
      return res.status(404).json({ error: "Trainer not found" });
    }
    res.status(200).json(trainer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete trainer" });
  }
}
