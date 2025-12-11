import { NextFunction, Request, Response } from "express";
import { jwtDecode } from "jwt-decode";

export async function authenticator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = jwtDecode(token);
    console.log(decodedToken);

    // if (!decodedToken) {
    //   return res.status(401).json({ message: "Unauthorized" });
    // }

    // req.user = decodedToken;
    // next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
