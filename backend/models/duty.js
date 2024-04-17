import mongoose from "mongoose";

const performerDutySchema = new mongoose.Schema(
  {
    playerName: {
      type: String,
      required: [true, "Please enter Player Name"],
    },
    status: {
      type: Boolean,
      required: [true, "Please enter Status"],
    },
    email: {
      type: String,
      required: [true, "Please enter Email"],
    },
    startTime: {
      type: String,
      required: [true, "Please enter start time"],
    },
    endTime: {
      type: String,
      required: [true, "Please enter end time"],
    },
  },
  {
    timestamps: true,
  }
);

const duty =
  mongoose.models.duty || mongoose.model("duty", performerDutySchema);

export default duty;
