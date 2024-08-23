

import { Router } from "express";
import userHandler from "../middlewares/userHandler";
import { getRepo, sendRepo, updateRole, verifySignature } from "../controllers/userController";

const userRoutes = Router();
userRoutes.get("/repo", userHandler, getRepo);
userRoutes.post("/repo", userHandler, sendRepo);
userRoutes.post("/update-role", updateRole);

// New route for signature verification
userRoutes.post("/verify-signature", userHandler, verifySignature);


export default userRoutes;