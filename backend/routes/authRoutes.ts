import { Router } from "express";
import { getUser } from "../controllers/authController";

const authRoutes = Router();

authRoutes.get("/", getUser);

export default authRoutes;
