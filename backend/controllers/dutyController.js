import Players from "../models/players";
import ResponseModel from "./responseModel";

export const getAllStaff = async (req, res, next) => {
  const players = await Players.find().select("firstName lastName duty");
  const response = new ResponseModel(
    true,
    "Staff fetched successfully",
    players
  );
  res.status(200).json(response);
};

export const updateDutyStatus = async (req, res, next) => {
  const id = req.query.id;
  const { status } = req.body;

  const player = await Players.findByIdAndUpdate(
    id,
    { $set: { "duty.status": status } },
    { new: true }
  );
  const response = new ResponseModel(true, "Status updated successfully");
  res.status(200).json(response);
};
