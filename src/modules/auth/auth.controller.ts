import { type RequestHandler } from "express";
import { type LoginInput, type SignupInput } from "./auth.validation";
import { login, signup } from "./auth.service";

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
