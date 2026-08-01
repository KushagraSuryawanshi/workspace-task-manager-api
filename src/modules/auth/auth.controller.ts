import { type RequestHandler } from "express";
import { type LoginInput, type SignupInput } from "./auth.validation";
import { getCurrentUser, login, signup } from "./auth.service";
import { HttpError } from "../../errors/HttpError";

export const signupController: RequestHandler<
  Record<string, never>,
  unknown,
  SignupInput
> = async (req, res) => {
  const result = await signup(req.body);
  res.status(201).json({ success: true, data: result });
};

export const loginController: RequestHandler<
  Record<string, never>,
  unknown,
  LoginInput
> = async (req, res) => {
  const result = await login(req.body);
  res.status(200).json({ success: true, data: result });
};

export const getCurrentUserController: RequestHandler = async (req, res) => {
  if (!req.auth) {
    throw new HttpError(
      401,
      "INVALID_ACCESS_TOKEN",
      "Access token is missing or invalid",
    );
  }
  const userProfile = await getCurrentUser(req.auth.userId);

  return res.status(200).json({ success: true, data: userProfile });
};
