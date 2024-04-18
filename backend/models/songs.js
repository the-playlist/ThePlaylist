import mongoose from "mongoose";

const songsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter title"],
    },
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
    qualifiedPlayer: Boolean,
    isFav: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Songs = mongoose.models.Songs || mongoose.model("Songs", songsSchema);

export default Songs;
