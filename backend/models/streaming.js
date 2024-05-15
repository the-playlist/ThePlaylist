import mongoose, { Schema } from "mongoose";

const streamRequestSchema = new Schema(
  {
    url: String,
    tableNo: Number,
    userId: String,
    callId: String,
    token: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Stream =
  mongoose.models.Stream || mongoose.model("Stream", streamRequestSchema);

export default Stream;
