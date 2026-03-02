import { AppError } from "./AppError";
import { Error4XX, Error5XX } from "./errorTypes";


export default function createError(
  message: string,
  messageCode: Error4XX | Error5XX,
) {
  // Error4XX is now a value at runtime (the object), so we can use Object.values
  if (
    (Object.values(Error4XX) as (Error4XX | Error5XX)[]).includes(messageCode)
  ) {
    // Handle 4XX errors if needed, or just return the error
    return new AppError(message, messageCode);
  }

  return new AppError(message, messageCode);
}
