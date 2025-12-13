import { Request, Response } from "express";
import { jwtDecode } from "jwt-decode";
import jwt from "jsonwebtoken";
import EmailModel from "../models/email.js";

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
