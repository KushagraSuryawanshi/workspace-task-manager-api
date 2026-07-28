import { type RequestHandler } from "express";
import { type SignupInput } from "./auth.validation";
import { signup } from "./auth.service";

export const signupController: RequestHandler<
  Record<string, never>,
  unknown,
  SignupInput
> = async (req, res) => {
  const result = await signup(req.body);
  res.status(201).json({ success: true, data: result });
};
