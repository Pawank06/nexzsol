import { Router } from "express";
import { manageComment } from "../controllers/hookController";

const hookRoutes = Router();
hookRoutes.post("/webhook", manageComment);
export default hookRoutes;