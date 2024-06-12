import Players from "../models/players";
import Songs from "../models/songs";
import ResponseModel from "./responseModel";

export const addUpdatePlayer = async (req, res, next) => {
  const id = req?.body?.id;
  if (!id) {
    const players = await Players.create(req.body);
    let response = new ResponseModel(
      true,
      "Player added successfully",
      players
    );
    res.status(200).json(response);
  } else {
    let player = await Players.findByIdAndUpdate(id, req.body, { new: true });
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }
    let response = new ResponseModel(
      true,
      "Player updated successfully",
      player
    );
    res.status(200).json(response);
  }
};

export const getAllPlayers = async (req, res, next) => {
  const players = await Players.find().populate(
    "assignSongs",
    "title , artist , _id",
    Songs
  );
  const response = new ResponseModel(
    true,
    "Players fetched successfully",
    players
  );
  res.status(200).json(response);
};

export const deletePlayerById = async (req, res, next) => {
  const id = req.query.id;
  if (!id) {
    return res.status(400).json({ message: "ID parameter is missing" });
  }
  await Players.findByIdAndDelete(id);
  const players = await Players.find();
  const response = new ResponseModel(true, "Player deleted successfully", null);
  res.status(200).json(response);
};
