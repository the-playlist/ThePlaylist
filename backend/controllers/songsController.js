import Players from "../models/players";
import Songs from "../models/songs";
import ResponseModel from "./responseModel";

export const addNewSong = async (req, res, next) => {
  try {
    const { title } = await req.body;
    const existingSong = await Songs.findOne({ title });
    if (existingSong) {
      res.status(400).json({
        message: "Song already exists",
      });
    } else {
      const songs = await Songs.create(req.body);
      res.status(200).json({
        songs,
        message: "Song added successfully",
      });
    }
  } catch (error) {
    const response = new ResponseModel(
      false,
      "An error occurred",
      error.message
    );
    res.status(500).json(response);
  }
};

export const updateSong = async (req, res, next, id) => {
  let song = await Songs.findByIdAndUpdate(id, req.body, { new: true });
  if (!song) {
    return res.status(404).json({ message: "Song not found" });
  }
  res.status(200).json({
    song,
    message: "Song updated successfully",
  });
};

export const addUpdateSong = async (req, res, next) => {
  const id = req.query.id;
  try {
    if (!id) {
      addNewSong(req, res, next);
    } else {
      updateSong(req, res, next, id);
    }
  } catch (error) {}
};

export const getAllSongs = async (req, res, next) => {
  try {
    let data;

    const { keyword } = req.query;

    if (keyword) {
      data = await Songs.find({ title: { $regex: new RegExp(keyword, "i") } });
    } else {
      data = await Songs.find().lean();
    }

    const response = new ResponseModel(
      true,
      "Songs fetched successfully",
      data
    );
    res.status(200).json(response);
  } catch (error) {
    const response = new ResponseModel(
      false,
      "An error occurred",
      error.message
    );
    res.status(500).json(response);
  }
};

export const deleteSongById = async (req, res, next) => {
  const id = req.query.id;
  if (!id) {
    return res.status(400).json({ message: "ID parameter is missing" });
  }

  try {
    await Songs.findByIdAndDelete(id);
    const songs = await Songs.find();
    res.status(200).json({
      songs,
      message: "Song deleted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while deleting the song", error });
  }
};

export const getSongByPlayerId = async (req, res, next) => {
  const _id = req.query.id;
  if (!_id) {
    return res.status(400).json({ message: "ID parameter is missing" });
  }

  try {
    const { assignSongs } = await Players.findOne({ _id });
    res.status(200).json({
      assignSongs,
      message: "Song fetched successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while deleting the song", error });
  }
};

export const getSongByOnDutyPlayer = async (req, res, next) => {
  const onDuty = req.query.onDuty;
  if (!onDuty) {
    return res.status(400).json({ message: "onDuty parameter is missing" });
  }
  try {
    const data = await Players.find({ onDuty: onDuty });
    const response = new ResponseModel(
      true,
      "Songs fetched successfully",
      data
    );
    res.status(200).json({
      response,
    });
  } catch (error) {
    const response = new ResponseModel(
      false,
      "An error occurred while deleting the song",
      error.message
    );
    res.status(500).json(response);
  }
};
