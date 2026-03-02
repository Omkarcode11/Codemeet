import { NextFunction, Request, Response } from "express";
import { AppError } from "./AppError";
import logger from "../../utils/logger";

const sendErrorDev = (err: AppError | Error, res: Response) => {
  const statusCode = (err as AppError).messageCode || 500;
  res.status(statusCode).json({
    status: (err as AppError).status || "error",
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError | Error, res: Response) => {
  const statusCode = (err as AppError).messageCode || 500;

  // Operational, trusted error: send message to client
  if ((err as AppError).isOperational) {
    res.status(statusCode).json({
      status: (err as AppError).status,
      message: err.message,
    });
  }
  // Programming or other unknown error: don't leak error details
  else {
    logger.error("ERROR 💥", err);
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

export default function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    sendErrorProd(err, res);
  }
}
