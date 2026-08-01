import type { RequestHandler } from "express";
import { HttpError } from "../errors/HttpError";
import { verifyAccessToken } from "../utils/token";

export const authenticate: RequestHandler = async (req, _res, next) => {
  const authorizationParts = req.headers.authorization?.split(" ");
  if (!authorizationParts || authorizationParts.length !== 2) {
    throw new HttpError(
      401,
      "INVALID_ACCESS_TOKEN",
      "Access token is missing or invalid",
    );
  }
  const scheme = authorizationParts[0];
  const token = authorizationParts[1];

  if (scheme !== "Bearer" || !token) {
    throw new HttpError(
      401,
      "INVALID_ACCESS_TOKEN",
      "Access token is missing or invalid",
    );
  }
  try {
    const tokenPayload = await verifyAccessToken(token);
    req.auth = { userId: tokenPayload.userId };
    return next();
  } catch {
    throw new HttpError(
      401,
      "INVALID_ACCESS_TOKEN",
      "Access token is missing or invalid",
    );
  }
};
