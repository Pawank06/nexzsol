import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import cors from "cors";
const app = express();

// routes
app.use(express.json());
app.use(cors());
app.get("/", (req, res, next) => {
  res.send("Hello nexzsol");
});
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

// global error handler
app.use(globalErrorHandler)

export default app;