import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    assignedPlayer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Players",
      required: [true, "Assigned Player Info is necessory"],
    },
    qualifiedPlayers: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Players",
          required: [true, "Qulified Player Info is necessory"],
        },
        name: {
          type: String,
        },
      },
    ],
    songData: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Songs",
      required: [true, "Song Info is necessory"],
    },

    upVote: { type: Number, default: 0 },
    downVote: { type: Number, default: 0 },
    sortOrder: {
      type: Number,
      default: 0,
    },
    isDeleted: { type: Boolean, default: false },
    expiresAt: { type: Date, default: Date.now, index: { expires: "1m" } },
    sortByMaster: {
      type: Boolean,
      default: false,
    },
    addByCustomer: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Playlist =
  mongoose.models.Playlist || mongoose.model("Playlist", playlistSchema);

export default Playlist;
