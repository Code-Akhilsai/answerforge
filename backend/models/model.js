import mongoose from "mongoose";

const modelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);
export const Model = mongoose.model("Model", modelSchema);
