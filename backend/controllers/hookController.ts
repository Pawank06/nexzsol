import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import logsModel from "../models/logsModel";
import { error } from "console";

const manageComment = async (req: Request, res: Response) => {
  try {
    // console.log("hearers :- " , req.headers , " body :- " , req.body , " event " , req.headers["x-github-event"]);

    
    // console.log(req.body);
    
    const event = req.headers["x-github-event"] 
    console.log("event :- " , event);
    if (event === "issue_comment") {
      console.log("inside issue comment");
      const comment = req.body.comment;
      console.log("comment :- " , comment);
      const commentBody = comment.body;
      console.log("commentBody :- " , commentBody);

      if (comment.author_association === "OWNER") {
        console.log("inside owner");
        if (commentBody.includes("/bounty")) {
          const contributor = commentBody.split("@")[1].split(" ")[0];
          const amount = commentBody.split("sol-")[1];
          console.log("contributor :- " , contributor , " amount :- " , amount);
          const LogModel = await logsModel.create({
            gitId: comment.id,
            action: "comment",
            timestamp: Date.now(),
            log: {
              contributor,
              amount,
            },
          });
          console.log("LogModel :- " , LogModel);
          await LogModel.save();
        }
        res.status(200).json({ message: "Comment logged successfully" });
      }
    } else {
      res.status(200).json({ message: req.headers["x-github-event"]});
    }
  } catch (err) {
    console.log("error " , err);
    res.status(500).json({ error: "Internal Server Error", details: err });
  }
};

export { manageComment };
