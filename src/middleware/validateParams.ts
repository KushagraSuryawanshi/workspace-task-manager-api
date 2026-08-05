import { type RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

import { z } from "zod";
import { HttpError } from "../errors/HttpError";

export const validateParams = <TParams extends ParamsDictionary>(
  schema: z.ZodType<TParams>,
): RequestHandler<TParams> => {
  return (req, _res, next) => {
    const parsedParams = schema.safeParse(req.params);
    if (!parsedParams.success) {
      const error = new HttpError(
        400,
        "VALIDATION_ERROR",
        "Request params validation failed",
        z.treeifyError(parsedParams.error), 
      );
      return next(error);
    }
    req.params = parsedParams.data;
    return next();
  };
};
