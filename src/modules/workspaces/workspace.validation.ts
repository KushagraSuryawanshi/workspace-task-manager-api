import { z } from "zod";

export const createWorkspaceSchema = z.strictObject({
  name: z.string().trim().min(1).max(100),
});

export const getWorkspaceParamsSchema = z.strictObject({
  workspaceId: z.string().regex(/^[a-fA-F0-9]{24}$/),
});

export const updateWorkspaceSchema = z.strictObject({
  name: z.string().trim().min(1).max(100),
});

export type GetWorkspaceParams = z.infer<typeof getWorkspaceParamsSchema>;

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;

export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;
