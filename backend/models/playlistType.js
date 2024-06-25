import mongoose from "mongoose";

const playlistTypeSchema = new mongoose.Schema(
  {
    isFavortiteListType: { type: Boolean, default: false },
    isFirst: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const PlaylistType =
  mongoose.models.PlaylistType ||
  mongoose.model("PlaylistType", playlistTypeSchema);

export default PlaylistType;
