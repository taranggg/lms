import { Request, Response } from "express";
import { jwtDecode } from "jwt-decode";
import jwt from "jsonwebtoken";
import EmailModel from "../models/email.js";
import StudentModel from "../models/student.js";
import bcrypt from "bcrypt";

export async function adminGoogleLogin(req: Request, res: Response) {
  try {
    const decodedToken = jwtDecode(req.body.token);
    //@ts-ignore
    const { email } = decodedToken;
    const isEmailExist = await EmailModel.findOne({ email });
    if (isEmailExist) {
      const token = jwt.sign(
        { email, role: isEmailExist.role },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "9h",
        }
      );
      return res.status(200).json({ token });
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function trainerGoogleLogin(req: Request, res: Response) {
  try {
    const decodedToken = jwtDecode(req.body.token);
    //@ts-ignore
    const { email } = decodedToken;
    const isEmailExist = await EmailModel.findOne({ email });
    if (isEmailExist) {
      const token = jwt.sign(
        { email, role: isEmailExist.role },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "9h",
        }
      );
      return res.status(200).json({ token });
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function studentLogin(req: Request, res: Response) {
  try {
    const { studentId, password } = req.body;
    const student = await StudentModel.findOne({ studentId });
    if (!student) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (student.firstLogin) {
      const isPasswordMatch = await bcrypt.compare(password, student.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      return res
        .status(200)
        .json({ message: "First Login! Update your password" });
    } else {
      const isPasswordMatch = await bcrypt.compare(password, student.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const token = jwt.sign(
        { email: student.email, role: "student" },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "9h",
        }
      );
      return res.status(200).json({ token });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
