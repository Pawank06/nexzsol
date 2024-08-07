import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app = express();

// routes

app.get("/", (req, res, next) => {
  res.send("Hello nexzsol");
});

// global error handler
app.use(globalErrorHandler)

export default app;