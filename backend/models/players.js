import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please enter First Name"],
    },
    lastName: {
      type: String,
      required: [true, "Please enter Last Name"],
    },
    email: {
      type: String,
      required: [true, "Please enter Email"],
    },
    phone: {
      type: Number,
      required: [true, "Please enter Phone"],
    },
    assignSongs: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "song",
    },

    onDuty: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Players =
  mongoose.models.player || mongoose.model("player", playerSchema);

export default Players;
