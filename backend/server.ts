import app from "./app";
import { config } from "./config/config";
import connectDB from "./config/db";

const startServer = async () => {
  // connect to database
  await connectDB();

  const port = config.port || 5513;

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();