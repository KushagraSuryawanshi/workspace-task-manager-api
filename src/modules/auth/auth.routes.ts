import { Router } from "express";
import { validateBody } from "../../middleware/validateBody";
import { signupSchema } from "./auth.validation";
import { signupController } from "./auth.controller";

export const authRouter = Router();

authRouter.post("/signup", validateBody(signupSchema), signupController);
