import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter title"],
    },
    playerName: {
      type: String,
      required: [true, "Please enter Player Name"],
    },
    upVote: { type: Number, default: 0 },
    downVote: { type: Number, default: 0 },
    artist: {
      type: String,
      required: [true, "Please enter artist Name"],
    },
    introSec: {
      type: String,
      required: [false, "Please enter intro Seconds"],
    },
    songDuration: {
      type: String,
      required: [true, "Please enter song duration"],
    },
    category: {
      type: String,
      required: [true, "Please enter song category"],
    },
    isFav: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Playlist =
  mongoose.models.Playlist || mongoose.model("Playlist", playlistSchema);

export default Playlist;
