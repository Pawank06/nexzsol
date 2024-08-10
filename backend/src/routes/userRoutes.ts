import { getRepo, sendRepo } from "../controllers/userController";
import userHandler from "../middlewares/userHandler";
import { Router } from "express";

const userRoutes = Router();
userRoutes.get("/repo", userHandler, getRepo);
userRoutes.post("/repo", userHandler, sendRepo);

export default userRoutes;