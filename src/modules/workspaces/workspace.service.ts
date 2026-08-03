import mongoose from "mongoose";
import type { CreateWorkspaceInput } from "./workspace.validation";
import { UserModel } from "../users/user.model";
import { HttpError } from "../../errors/HttpError";
import { WorkspaceModel } from "./workspace.model";
import { MembershipModel } from "../memberships/membership.model";

export const createWorkspace = async (
  input: CreateWorkspaceInput,
  userId: string,
) => {
  return mongoose.connection.transaction(async (session) => {
    const user = await UserModel.findById(userId).session(session);
    if (!user) {
      throw new HttpError(404, "USER_NOT_FOUND", "User not found");
    }

    const workspace = new WorkspaceModel({
      name: input.name,
      ownerId: user._id,
    });
    await workspace.save({ session });

    const membership = new MembershipModel({
      userId: user._id,
      workspaceId: workspace._id,
      role: "OWNER",
    });
    await membership.save({ session });
    return workspace;
  });
};
