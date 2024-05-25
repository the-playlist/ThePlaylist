import mongoose from "mongoose";

const limitSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: [true, "Please enter heading"],
    },
    title: {
      type: String,
      required: [true, "Please enter title"],
    },

    subTitle: {
      type: String,
      default: "",
    },
    value: {
      type: Number,
      default: 0,
    },
    time: {
      type: Number,
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);

const Limit = mongoose.models.Limit || mongoose.model("Limit", limitSchema);

export default Limit;
