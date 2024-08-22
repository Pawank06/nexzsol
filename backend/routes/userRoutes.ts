

import { Router } from "express";
import userHandler from "../middlewares/userHandler";
import { getRepo, sendRepo, verifySignature } from "../controllers/userController";

const userRoutes = Router();
userRoutes.get("/repo", userHandler, getRepo);
userRoutes.post("/repo", userHandler, sendRepo);

// New route for signature verification
userRoutes.post("/verify-signature", userHandler, verifySignature);


export default userRoutes;