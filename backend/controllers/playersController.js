import Players from "../models/players";
import song from "../models/songs";
import ResponseModel from "./responseModel";

export const addNewPlayer = async (req, res, next) => {
  try {
    const players = await Players.create(req.body);
    const response = new ResponseModel(
      true,
      "Players added successfully",
      players
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updatePlayer = async (req, res, next, id) => {
  let player = await Players.findByIdAndUpdate(id, req.body, { new: true });
  try {
    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }
    res.status(200).json({
      player,
      message: "Player updated successfully",
    });
  } catch (error) {}
};

export const addUpdatePlayer = async (req, res, next) => {
  const id = req.query.id;
  try {
    if (!id) {
      addNewPlayer(req, res, next);
    } else {
      updatePlayer(req, res, next, id);
    }
  } catch (error) {}
};

export const getAllPlayers = async (req, res, next) => {
  try {
    const players = await Players.find().populate(
      "assignSongs",
      "title , artist , _id"
    );
    const response = new ResponseModel(
      true,
      "Players fetched successfully",
      players
    );
    res.status(200).json({
      response,
    });
  } catch (error) {
    const response = new ResponseModel(false, error.message);
    res.status(200).json({
      response,
    });
  }
};
export const deletePlayerById = async (req, res, next) => {
  const id = req.query.id;
  if (!id) {
    return res.status(400).json({ message: "ID parameter is missing" });
  }

  try {
    await Players.findByIdAndDelete(id);
    const players = await Players.find();
    res.status(200).json({
      players,
      message: "Player deleted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while deleting the player", error });
  }
};
