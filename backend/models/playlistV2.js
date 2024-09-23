import mongoose from "mongoose";

const playlistSchemaV2 = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

const PlaylistV2 =
  mongoose.models.PlaylistV2 || mongoose.model("PlaylistV2", playlistSchemaV2);

export default PlaylistV2;
