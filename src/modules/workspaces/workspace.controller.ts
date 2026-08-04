import type { RequestHandler } from "express";
import { HttpError } from "../../errors/HttpError";
import { createWorkspace } from "./workspace.service";
import type { CreateWorkspaceInput } from "./workspace.validation";

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
