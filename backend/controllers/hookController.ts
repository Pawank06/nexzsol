import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import logsModel from "../models/logsModel";
import { error } from "console";

const manageComment = async (req: Request, res: Response) => {
  try {
    console.log("hearers :- " , req.headers , " body :- " , req.body);
    logsModel.create({
      gitId: "11",
      action: "comment",
      timestamp: Date.now(),
      log: {
        reqHeaders: req.headers,
        reqBody: req.body
      },
    });
    // console.log(req.body);
    const event = req.headers["X-GitHub-Event"];
    if (event === "issue_comment") {
      const { comment } = req.body;
      const commentBody = comment.body;
      if (commentBody.author_association === "OWNER") {
        if (commentBody.includes("/bounty")) {
          const contributor = commentBody.split("@")[1].split(" ")[0];
          const amount = commentBody.split("sol-")[1];
          logsModel.create({
            gitId: comment.id,
            action: "comment",
            timestamp: Date.now(),
            log: {
              contributor,
              amount,
            },
          });
        }
        res.status(200).json({ message: "Comment logged successfully" });
      }
    } else {
      res.status(200).json({ message: req.headers});
    }
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", details: err });
  }
};

export { manageComment };
