import { NextFunction, Response, Request } from "express";
import { HttpError } from "http-errors";
import { config } from "../config/config";

const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    message: err.message,
    //stack ko sirf development purpose ke liye use krna sahi h, isko production m nahi use krna chahiye for security reason
    errorsStack: config.env === "development" ? err.stack : "", //gives full detailed information about error, in which its giving error like that
  });
};

export default globalErrorHandler;
