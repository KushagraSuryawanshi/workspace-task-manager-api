import type { RequestHandler } from "express";
import { HttpError } from "../../errors/HttpError";
import {
  createWorkspace,
  getUserWorkspaces,
  getWorkspace,
} from "./workspace.service";
import type {
  CreateWorkspaceInput,
  GetWorkspaceParams,
} from "./workspace.validation";

export const createWorkspaceController: RequestHandler<
  Record<string, never>,
  unknown,
  CreateWorkspaceInput
> = async (req, res) => {
  if (!req.auth) {
    throw new HttpError(
      401,
      "INVALID_ACCESS_TOKEN",
      "Access token is missing or invalid",
    );
  }

  const workspace = await createWorkspace(req.body, req.auth.userId);

  return res.status(201).json({
    success: true,
    data: { workspace },
  });
};

export const getUserWorkspacesController: RequestHandler<
  Record<string, never>,
  unknown,
  unknown
> = async (req, res) => {
  if (!req.auth) {
    throw new HttpError(
      401,
      "INVALID_ACCESS_TOKEN",
      "Access token is missing or invalid",
    );
  }

  const workspaces = await getUserWorkspaces(req.auth.userId);

  return res.status(200).json({
    success: true,
    data: {
      workspaces,
    },
  });
};

export const getWorkspaceController: RequestHandler<
  GetWorkspaceParams,
  unknown,
  unknown
> = async (req, res) => {
  if (!req.auth) {
    throw new HttpError(
      401,
      "INVALID_ACCESS_TOKEN",
      "Access token is missing or invalid",
    );
  }

  const workspace = await getWorkspace(req.auth.userId, req.params.workspaceId);
  res.status(200).json({
    success: true,
    data: { workspace },
  });
};
