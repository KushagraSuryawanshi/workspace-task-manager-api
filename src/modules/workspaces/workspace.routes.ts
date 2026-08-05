import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { validateBody } from "../../middleware/validateBody";
import {
  createWorkspaceSchema,
  getWorkspaceParamsSchema,
} from "./workspace.validation";
import {
  createWorkspaceController,
  getUserWorkspacesController,
  getWorkspaceController,
} from "./workspace.controller";
import { validateParams } from "../../middleware/validateParams";

export const workspaceRouter = Router();

workspaceRouter.post(
  "/",
  authenticate,
  validateBody(createWorkspaceSchema),
  createWorkspaceController,
);

workspaceRouter.get("/", authenticate, getUserWorkspacesController);

workspaceRouter.get(
  "/:workspaceId",
  authenticate,
  validateParams(getWorkspaceParamsSchema),
  getWorkspaceController,
);
