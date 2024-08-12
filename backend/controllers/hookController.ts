import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import logsModel from "../models/logsModel";
import { error } from "console";

const manageComment = async (req: Request, res: Response) => {
  try {
    const event = req.headers["x-github-event"];
    if (event === "commit_comment") {
      const { comment, repository } = req.body;
      logsModel.create({
        gitId: comment.id,
        action: "comment",
        timestamp: Date.now(),
        log: {
          comment,
          repository,
        }
      });

        res.status(200).json({ message: "Comment logged successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", details: err });
  }
};

export { manageComment };