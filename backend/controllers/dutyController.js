import duty from "../models/duty";
import Players from "../models/players";
import ResponseModel from "./responseModel";

export const getAllStaff = async (req, res, next) => {
  const players = await Players.find().select("firstName lastName onDuty");
  const res = new ResponseModel(true, "Staff fetched successfully", players);
  res.status(200).json({
    res,
  });
};
