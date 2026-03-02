import winston from "winston";
import path from "path";

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define level based on environment
const level = () => {
  const env = process.env.NODE_ENV || "development";
  const isDevelopment = env === "development";
  return isDevelopment ? "debug" : "warn";
};

// Define colors for each level
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

// Tell winston that we want to link the colors
winston.addColors(colors);

// Custom format for console (readable + colorful)
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Format for files (JSON - easy to parse by log aggregators)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.json(),
);

// Define which transports the logger must use
const transports = [
  // Allow the use the console to print the messages
  new winston.transports.Console({
    format: consoleFormat,
  }),
  // Allow to print all the error level messages inside the error.log file
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
    format: fileFormat,
  }),
  // Allow to print all the error level messages inside the combined.log file
  new winston.transports.File({
    filename: "logs/all.log",
    format: fileFormat,
  }),
];

// Create the logger instance
const logger = winston.createLogger({
  level: level(),
  levels,
  transports,
});

export default logger;
