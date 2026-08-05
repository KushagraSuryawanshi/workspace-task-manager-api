import { model, Schema, type InferSchemaType } from "mongoose";

const membershipSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    workspaceId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Workspace",
    },
    role: {
      type: String,
      enum: ["OWNER", "ADMIN", "MEMBER"],
      required: true,
    },
  },
  { timestamps: true },
);

membershipSchema.index({ workspaceId: 1, userId: 1 }, { unique: true });
membershipSchema.index({ userId: 1 });

export const  MembershipModel = model("Membership", membershipSchema);
export type Membership = InferSchemaType<typeof membershipSchema>;
