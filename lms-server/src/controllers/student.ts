import { Request, Response } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import mongoose from "mongoose";
import { sendWelcomeEmail } from "../utils/Email.js";
import StudentModel from "../models/student.js";

export const createStudent = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const year = new Date().getFullYear();
    const prefix = `STU${year}`;
    const lastStudent = await StudentModel.findOne({
      studentId: { $regex: `^${prefix}` },
    }).sort({ studentId: -1 });

    let newSerial = 1;
    if (lastStudent && lastStudent.studentId) {
      const lastSerial = parseInt(lastStudent.studentId.replace(prefix, ""));
      if (!isNaN(lastSerial)) {
        newSerial = lastSerial + 1;
      }
    }

    const serialString = newSerial.toString().padStart(4, "0");
    const studentId = `${prefix}${serialString}`;
    const plainPassword = crypto.randomBytes(4).toString("hex"); // 8 chars hex
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const student = await StudentModel.create({
      ...req.body,
      studentId: studentId,
      password: hashedPassword,
      firstLogin: true,
    });

    sendWelcomeEmail(email, name, plainPassword);

    res.status(201).send("Added Student Successfully");
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const { branch, batch, course, search } = req.query;

    const pipeline: any[] = [];
    const matchStage: any = {};

    // 1. Direct Filters (Branch & Search)
    if (branch) {
      matchStage.branch = new mongoose.Types.ObjectId(branch as string);
    }

    if (search) {
      matchStage.$or = [
        { name: { $regex: search, $options: "i" } },
        { studentId: { $regex: search, $options: "i" } },
      ];
    }

    // Apply match stage if not empty
    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    // 2. Filter by Batch (Requires Lookup)
    if (batch) {
      pipeline.push({
        $lookup: {
          from: "studentbatchlinks",
          localField: "_id",
          foreignField: "student",
          as: "batchLinks",
        },
      });
      pipeline.push({
        $match: {
          "batchLinks.batch": new mongoose.Types.ObjectId(batch as string),
        },
      });
    }

    // 3. Filter by Course (Requires Lookup)
    if (course) {
      pipeline.push({
        $lookup: {
          from: "coursestudentlinks",
          localField: "_id",
          foreignField: "student",
          as: "courseLinks",
        },
      });
      pipeline.push({
        $match: {
          "courseLinks.course": new mongoose.Types.ObjectId(course as string),
        },
      });
    }

    // 4. Cleanup (Project)
    pipeline.push({
      $project: {
        batchLinks: 0,
        courseLinks: 0,
        password: 0, // Don't send password
        __v: 0,
      },
    });

    const students = await StudentModel.aggregate(pipeline);
    res.status(200).send(students);
  } catch (error) {
    console.error("Error getting students:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const getStudentById = async (req: Request, res: Response) => {
  try {
    const student = await StudentModel.findById(req.params.id);
    res.status(200).send(student);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const student = await StudentModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    res.status(200).send("Updated Student Successfully");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const student = await StudentModel.findByIdAndDelete(req.params.id);
    res.status(200).send("Deleted Student Successfully");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

export const getStudentByBranch = async (req: Request, res: Response) => {
  try {
    const students = await StudentModel.find({ branch: req.params.branch });
    res.status(200).send(students);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
