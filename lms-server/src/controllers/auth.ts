import { Request, Response } from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import EmailModel from "../models/email.js";
import StudentModel from "../models/student.js";
import bcrypt from "bcrypt";
import { google } from "googleapis";
import TrainerModel from "../models/trainer.js";

export async function adminGoogleLogin(req: Request, res: Response) {
  try {
    const { token } = req.body;
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const { email } = response.data;
    const isEmailExist = await EmailModel.findOne({ email });
    if (isEmailExist) {
      const jwtToken = jwt.sign(
        { email, role: isEmailExist.role },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "9h",
        }
      );
      return res.status(200).json({ token: jwtToken });
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
    const { token } = req.body;
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const { email } = response.data;
    const isEmailExist = await EmailModel.findOne({ email });
    if (isEmailExist) {
      const jwtToken = jwt.sign(
        { email, role: isEmailExist.role },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "9h",
        }
      );
      const trainer = await TrainerModel.findOne({ email: isEmailExist._id });

      return res.status(200).json({
        token: jwtToken,
        firstLogin: trainer?.firstLogin,
        trainerId: trainer?._id,
      });
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function connectGoogle(req: Request, res: Response) {
  try {
    const { code, trainerId } = req.body;
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const { tokens } = await oauth2Client.getToken(code);

    if (tokens.refresh_token) {
      await TrainerModel.findByIdAndUpdate(trainerId, {
        googleRefreshToken: tokens.refresh_token,
        firstLogin: false,
      });
      res
        .status(200)
        .json({ message: "Google account connected successfully" });
    } else {
      res
        .status(400)
        .json({ error: "Failed to retrieve refresh token. Try again." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to connect Google account" });
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

export async function updateStudentPassword(req: Request, res: Response) {
  try {
    const { studentId, oldPassword, newPassword } = req.body;
    const student = await StudentModel.findOne({ studentId });
    if (!student) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const isPasswordMatch = await bcrypt.compare(oldPassword, student.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    student.password = await bcrypt.hash(newPassword, 10);
    await student.save();
    const token = jwt.sign(
      { email: student.email, role: "student" },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "9h",
      }
    );
    return res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function verifyToken(req: Request, res: Response) {
  try {
    const { token } = req.body;
    const decodedToken: any = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );
    return res.status(200).json({ role: decodedToken.role, verified: true });
  } catch (error) {
    console.log(error);
    return res
      .status(401)
      .json({ message: "Unauthorized! Please Signin Again!" });
  }
}
