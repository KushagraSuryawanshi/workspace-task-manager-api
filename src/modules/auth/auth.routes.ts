import { Router } from "express";
import { validateBody } from "../../middleware/validateBody";
import { loginSchema, signupSchema } from "./auth.validation";
import { loginController, signupController } from "./auth.controller";

export const authRouter = Router();

authRouter.post("/signup", validateBody(signupSchema), signupController);
authRouter.post("/login", validateBody(loginSchema), loginController);
