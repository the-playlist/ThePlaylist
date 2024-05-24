import mongoose from "mongoose";

const themeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter title"],
    },
    mode: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Theme = mongoose.models.Theme || mongoose.model("Theme", themeSchema);

export default Theme;
