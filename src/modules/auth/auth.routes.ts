import { Router } from "express";
import { validateBody } from "../../middleware/validateBody";
import { loginSchema, signupSchema } from "./auth.validation";
import { getCurrentUserController, loginController, signupController } from "./auth.controller";
import { authenticate } from "../../middleware/authenticate";

export const authRouter = Router();

authRouter.post("/signup", validateBody(signupSchema), signupController);
authRouter.post("/login", validateBody(loginSchema), loginController);
authRouter.get("/me", authenticate, getCurrentUserController);
