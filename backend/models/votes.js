import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: [true, "Please enter Customer Id"],
    },
    songId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Songs",
    },
    playlistItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Playlist",
    },
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Players",
    },
    isUpVote: {
      type: mongoose.Schema.Types.Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Vote = mongoose.models.Vote || mongoose.model("Vote", voteSchema);

export default Vote;
