import express from "express";
import cors from "cors";
import morgan from "morgan";
import errorHandler from "./middleware/error/errorHandler";
import logger from "./utils/logger";

import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import dotenv from "dotenv";

dotenv.config();
const app = express();

// Request logging middleware
const stream = {
  write: (message: string) => logger.http(message.trim()),
};

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms", {
    stream,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"], // Adjust to your client URL
    credentials: true,
  }),
);

app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => {
  res.send("OK");
});

// Global Error Handler (Must be LAST)
app.use(errorHandler);

app.listen(3000, () => {
  logger.info("Server is running on port 3000");
});
