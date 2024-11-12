import mongoose from "mongoose";

const algorithmStatusSchema = new mongoose.Schema(
  {
    isApplied: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const AlgorithmStatus =
  mongoose.models.AlgorithmStatus ||
  mongoose.model("AlgorithmStatus", algorithmStatusSchema);

export default AlgorithmStatus;
