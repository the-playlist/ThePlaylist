import mongoose from "mongoose";

const playlistSchemaV2 = new mongoose.Schema(
  {
    assignedPlayer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Players",
      required: [true, "Assigned Player Info is necessary"],
    },
    qualifiedPlayers: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Players",
          required: [true, "Qualified Player Info is necessary"],
        },
        name: {
          type: String,
        },
      },
    ],
    songData: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Songs",
      required: [true, "Song Info is necessary"],
    },
    isFixed: {
      type: Boolean,
      default: false,
    },
    upVote: { type: Number, default: 0 },
    downVote: { type: Number, default: 0 },
    sortOrder: {
      type: Number,
      default: 0,
    },
    isDeleted: { type: Boolean, default: false },
    sortByMaster: {
      type: Boolean,
      default: false,
    },
    addByCustomer: {
      type: Boolean,
      default: false,
    },
    songAddedAt: {
      type: Date, // Track when the song was added to the playlist
      default: null,
    },
    applySwap: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

const PlaylistV2 =
  mongoose.models.PlaylistV2 || mongoose.model("PlaylistV2", playlistSchemaV2);

export default PlaylistV2;
