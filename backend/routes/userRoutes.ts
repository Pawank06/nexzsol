

import { Router } from "express";
import userHandler from "../middlewares/userHandler";
import { getRepo, sendRepo, updateRole, verifySignature, getUserRepos, verifyPayment, getUserBalance, getAllUserRepos} from "../controllers/userController";

const userRoutes = Router();
userRoutes.get("/repo", userHandler, getRepo);
userRoutes.post("/repo", userHandler, sendRepo);
userRoutes.get("/user/repos", getUserRepos)
userRoutes.post("/update-role", updateRole);
userRoutes.post('/verify-payment', verifyPayment);
userRoutes.get('/get-balance', getUserBalance);
userRoutes.get('/all-repo', getAllUserRepos)

// New route for signature verification
userRoutes.post("/verify-signature", userHandler, verifySignature);


export default userRoutes;