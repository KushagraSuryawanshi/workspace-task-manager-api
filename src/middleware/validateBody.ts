import { type RequestHandler } from "express";
import { z } from "zod";
import { HttpError } from "../errors/HttpError";

export const validateBody = (schema: z.ZodType): RequestHandler => {
  return (req, _res, next) => {
    const parsedBody = schema.safeParse(req.body);
    if (!parsedBody.success) {
      const error = new HttpError(
        400,
        "VALIDATION_ERROR",
        "Request body validation failed",
        z.treeifyError(parsedBody.error),
      );
      return next(error);
    }
    req.body = parsedBody.data;
    next();
  };
};
