import { Error4XX, Error5XX } from "./errorTypes";

export class AppError extends Error {
  public messageCode: Error4XX | Error5XX;
  public status: string;
  public isOperational: boolean;

  constructor(message: string, messageCode: Error4XX | Error5XX) {
    super(message);
    this.name = "AppError";
    this.messageCode = messageCode;
    // 4xx errors are 'fail', 5xx errors are 'error'
    this.status = `${messageCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
