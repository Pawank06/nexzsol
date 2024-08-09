import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import jwt from "jsonwebtoken";
const userHandler = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.token;
  jwt.verify(token as string, "shhhhh",async  function (err, decoded:any) {
    const id = decoded.id
    const userModel = await User.findById({id})
    if (!userModel) return res.send("Wrong Token").status(400)
    req.headers.accessToken = userModel.accessToken
  next();
  });
};

export default userHandler
