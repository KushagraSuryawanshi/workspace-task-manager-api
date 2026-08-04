import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { validateBody } from "../../middleware/validateBody";
import { createWorkspaceSchema } from "./workspace.validation";
import { createWorkspaceController } from "./workspace.controller";

export const workspaceRouter = Router();

workspaceRouter.post(
  "/",
  authenticate,
  validateBody(createWorkspaceSchema),
  createWorkspaceController,
);
