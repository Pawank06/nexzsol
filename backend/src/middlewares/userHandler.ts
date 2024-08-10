import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET || "defaultSecret";

const userHandler = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log("Token received:", token);

  jwt.verify(token, jwtSecret, async (err, decoded) => {
    if (err) {
      console.error("JWT verification error:", err);
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    if (!decoded) {
      return res.status(401).json({ error: "Token verification failed" });
    }

    const { id } = decoded as { id: string };

    try {
      const userModel = await User.findById(id);
      if (!userModel) {
        return res.status(400).json({ error: "User not found" });
      }

      req.headers.accessToken = userModel.accessToken;
      next();
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
};

export default userHandler;
