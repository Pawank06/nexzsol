import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import authRoutes from "./routes/authRoutes";
import hookRoutes from "./routes/hookRoutes";

import userRoutes from "./routes/userRoutes";
import cors from "cors";
import axios from "axios";
import { config } from "./config/config";
const app = express();

// routes
app.use(express.json());
app.use(cors());
app.get("/", (req, res, next) => {
  res.send("Hello nexzsol");
});
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/api", hookRoutes);

// global error handler
app.use(globalErrorHandler);

// const url = config.backendUrl as string;
// const interval = 30000;

// function reloadWebsite() {
//   axios
//     .get(url)
//     .then((response) => {
//       console.log(
//         `Reloaded at ${new Date().toISOString()}: Status Code ${
//           response.status
//         }`
//       );
//     })
//     .catch((error) => {
//       console.error(
//         `Error reloading at ${new Date().toISOString()}:`,
//         error.message
//       );
//     });
// }

// setInterval(reloadWebsite, interval);

export default app;
