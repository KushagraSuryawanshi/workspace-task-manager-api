import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { validateBody } from "../../middleware/validateBody";
import {
  createWorkspaceSchema,
  getWorkspaceParamsSchema,
  updateWorkspaceSchema,
} from "./workspace.validation";
import {
  createWorkspaceController,
  getUserWorkspacesController,
  getWorkspaceController,
  updateWorkspaceController,
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

workspaceRouter.patch(
  "/:workspaceId",
  authenticate,
  validateBody(updateWorkspaceSchema),
  validateParams(getWorkspaceParamsSchema),
  updateWorkspaceController,
);
