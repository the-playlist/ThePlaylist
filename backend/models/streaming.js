import mongoose, { Schema } from "mongoose";

const streamRequestSchema = new Schema(
  {
    url: String,
    tableNo: Number,
    userId: String,
  },
  {
    timestamps: true,
  }
);

const Stream =
  mongoose.models.Stream || mongoose.model("Stream", streamRequestSchema);

export default Stream;
