import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: [true, "Please enter symbol"],
    },
    standsFor: {
      type: String,
      required: [true, "Please enter standsFor"],
    },
  },
  {
    timestamps: true,
  }
);

const Location =
  mongoose.models.Location || mongoose.model("Location", locationSchema);

export default Location;
