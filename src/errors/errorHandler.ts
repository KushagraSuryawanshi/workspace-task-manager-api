import { type ErrorRequestHandler } from "express";
import { HttpError } from "./HttpError";

export const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    });
  }

  console.error(error);

  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
    },
  });
};
