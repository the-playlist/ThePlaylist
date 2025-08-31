import mongoose from "mongoose";

const playlistSchemaV2 = new mongoose.Schema(
  {
    assignedPlayer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Players",
      requred: false,
      index: true, // ✅ add index for faster lookup
    },
    qualifiedPlayers: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Players",
          requred: false,
          index: true, // ✅ useful if queried in aggregation
        },
        name: { type: String },
      },
    ],
    songData: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Songs",
      required: [true, "Song Info is necessary"],
      index: true, // ✅ since it's referenced often
    },
    isFixed: {
      type: Boolean,
      default: false,
      index: true, // ✅ speeds up filtering
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true, // ✅ used in countDocuments
    },
    isFav: {
      type: Boolean,
      default: false,
      index: true, // ✅ if you filter favorites
    },
    sortOrder: {
      type: Number,
      default: 0,
      index: true, // ✅ helpful if you sort
    },
    songAddedAt: {
      type: Date,
      default: null,
      index: true, // ✅ useful for sorting by recency
    },
    requestTime: {
      type: Date,
      default: () => new Date(),
      index: true, // ✅ useful for ordering
    },
    upVote: { type: Number, default: 0 },
    downVote: { type: Number, default: 0 },
    sortByMaster: { type: Boolean, default: false },
    addByCustomer: { type: Boolean, default: false },
    requestToPerform: { type: Boolean, default: false },
    applySwap: { type: Boolean, default: false },
    tableNo: { type: Number, default: null },
  },
  {
    timestamps: true,
  }
);

// ✅ Compound indexes (if you often query multiple filters together)
playlistSchemaV2.index({ isDeleted: 1, isFixed: 1 });
playlistSchemaV2.index({ isDeleted: 1, isFav: 1 });

const PlaylistV2 =
  mongoose.models.PlaylistV2 || mongoose.model("PlaylistV2", playlistSchemaV2);

export default PlaylistV2;
