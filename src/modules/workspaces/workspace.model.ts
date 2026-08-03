import { Schema, model, type InferSchemaType } from "mongoose";

const workspaceSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      minLength: 1,
      maxLenght: 100,
      required: true,
    },
    ownerId: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  },
  { timestamps: true },
);

export const WorkspaceModel = model("Workspace", workspaceSchema);

export type Workspace = InferSchemaType<typeof workspaceSchema>;
