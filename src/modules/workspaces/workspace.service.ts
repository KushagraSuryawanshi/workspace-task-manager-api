import mongoose, { Types } from "mongoose";
import type {
  AddWorkspaceMemberInput,
  CreateWorkspaceInput,
} from "./workspace.validation";
import { UserModel } from "../users/user.model";
import { HttpError } from "../../errors/HttpError";
import { WorkspaceModel, type Workspace } from "./workspace.model";
import { MembershipModel } from "../memberships/membership.model";

type PopulatedWorkspace = Workspace & { _id: Types.ObjectId };

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

export const getUserWorkspaces = async (userId: string) => {
  const memberships = await MembershipModel.find({ userId }).populate<{
    workspaceId: PopulatedWorkspace | null;
  }>("workspaceId");

  const workspaceSummaries = memberships.flatMap((membership) => {
    if (!membership.workspaceId) {
      return [];
    }
    return [
      {
        id: membership.workspaceId._id.toString(),
        name: membership.workspaceId.name,
        role: membership.role,
      },
    ];
  });

  return workspaceSummaries;
};

export const getWorkspace = async (userId: string, workspaceId: string) => {
  const membership = await MembershipModel.findOne({ userId, workspaceId });
  if (!membership) {
    throw new HttpError(
      403,
      "WORKSPACE_ACCESS_DENIED",
      "You do not have access to this workspace",
    );
  }
  const workspace = await WorkspaceModel.findById(membership.workspaceId);
  if (!workspace) {
    throw new HttpError(404, "WORKSPACE_NOT_FOUND", "Workspace doesn't exist");
  }

  return {
    id: workspace._id,
    name: workspace.name,
    ownerId: workspace.ownerId,
    role: membership.role,
    createdAt: workspace.createdAt,
    updatedAt: workspace.updatedAt,
  };
};

export const updateWorkspace = async (
  userId: string,
  workspaceId: string,
  name: string,
) => {
  const membership = await MembershipModel.findOne({ userId, workspaceId });
  if (!membership) {
    throw new HttpError(
      403,
      "WORKSPACE_ACCESS_DENIED",
      "You do not have access to this workspace",
    );
  }
  if (membership.role !== "OWNER" && membership.role !== "ADMIN") {
    throw new HttpError(
      403,
      "INSUFFICIENT_WORKSPACE_ROLE",
      "You must be an admin or owner to update this workspace",
    );
  }

  const updatedWorkspace = await WorkspaceModel.findOneAndUpdate(
    { _id: membership.workspaceId },
    { $set: { name } },
    { runValidators: true, returnDocument: "after" },
  );
  if (!updatedWorkspace) {
    throw new HttpError(404, "WORKSPACE_NOT_FOUND", "Workspace not found");
  }

  return {
    id: updatedWorkspace._id,
    name: updatedWorkspace.name,
    ownerId: updatedWorkspace.ownerId,
    createdAt: updatedWorkspace.createdAt,
    updatedAt: updatedWorkspace.updatedAt,
  };
};

export const addWorkspaceMember = async (
  requesterUserId: string,
  workspaceId: string,
  input: AddWorkspaceMemberInput,
) => {
  return mongoose.connection.transaction(async (session) => {
    const membership = await MembershipModel.findOne({
      userId: requesterUserId,
      workspaceId,
    }).session(session);
    if (!membership) {
      throw new HttpError(
        403,
        "WORKSPACE_ACCESS_DENIED",
        "You do not have access to this workspace",
      );
    }

    if (membership.role !== "ADMIN" && membership.role !== "OWNER") {
      throw new HttpError(
        403,
        "INSUFFICIENT_WORKSPACE_ROLE",
        "You must be an admin or owner to add workspace members",
      );
    }

    if (membership.role === "ADMIN" && input.role === "ADMIN") {
      throw new HttpError(
        403,
        "INSUFFICIENT_WORKSPACE_ROLE",
        "Only a workspace owner can add an admin",
      );
    }

    const workspace =
      await WorkspaceModel.findById(workspaceId).session(session);
    if (!workspace) {
      throw new HttpError(
        404,
        "WORKSPACE_NOT_FOUND",
        "Workspace doesn't exist",
      );
    }
    const user = await UserModel.findOne({ email: input.email }).session(
      session,
    );
    if (!user) {
      throw new HttpError(404, "USER_NOT_FOUND", "User doesn't exist");
    }

    try {
      const newMembership = new MembershipModel({
        userId: user._id,
        workspaceId: workspace._id,
        role: input.role,
      });
      const newMembershipSaved = await newMembership.save({ session });

      return {
        id: newMembershipSaved._id.toString(),
        userId: newMembership.userId.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: newMembershipSaved.role,
        createdAt: newMembershipSaved.createdAt,
      };
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === 11000
      ) {
        throw new HttpError(
          409,
          "USER_ALREADY_MEMBER",
          "user already a member of this worksapce",
        );
      }
      throw error;
    }
  });
};
