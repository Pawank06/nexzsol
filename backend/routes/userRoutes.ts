

import { Router } from "express";
import userHandler from "../middlewares/userHandler";
import { getRepo, sendRepo } from "../controllers/userController";

const userRoutes = Router();
userRoutes.get("/repo", userHandler, getRepo);
userRoutes.post("/repo", userHandler, sendRepo);

export default userRoutes;