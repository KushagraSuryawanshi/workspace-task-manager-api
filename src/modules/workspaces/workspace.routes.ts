import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { validateBody } from "../../middleware/validateBody";
import {
  addWorkspaceMemberSchema,
  createWorkspaceSchema,
  getWorkspaceParamsSchema,
  updateWorkspaceSchema,
} from "./workspace.validation";
import {
  addWorkspaceMemberController,
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
  validateParams(getWorkspaceParamsSchema),
  validateBody(updateWorkspaceSchema),
  updateWorkspaceController,
);

workspaceRouter.post(
  "/:workspaceId/members",
  authenticate,
  validateParams(getWorkspaceParamsSchema),
  validateBody(addWorkspaceMemberSchema),
  addWorkspaceMemberController,
);
