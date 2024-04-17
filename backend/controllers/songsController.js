import Players from "../models/players";
import Songs from "../models/songs";
import ResponseModel from "./responseModel";

export const addUpdateSong = async (req, res, next) => {
  const id = req.query.id;
  if (!id) {
    const songs = await Songs.create(req.body);
    res.status(201).json({
      songs,
      message: "Song added successfully",
    });
  } else {
    let song = await Songs.findByIdAndUpdate(id, req.body, { new: true });
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }
    res.status(200).json({
      song,
      message: "Song updated successfully",
    });
  }
};

export const getAllSongs = async (req, res, next) => {
  let data;
  const { keyword } = req.query;
  if (keyword) {
    data = await Songs.find({ title: { $regex: new RegExp(keyword, "i") } });
  } else {
    data = await Songs.find();
  }
  const response = new ResponseModel(true, "Songs fetched successfully", data);
  res.status(200).json(response);
};

export const deleteSongById = async (req, res, next) => {
  const id = req.query.id;
  if (!id) {
    return res.status(400).json({ message: "ID parameter is missing" });
  }

  await Songs.findByIdAndDelete(id);
  const songs = await Songs.find();
  res.status(200).json({
    songs,
    message: "Song deleted successfully",
  });
};

export const getSongByPlayerId = async (req, res, next) => {
  const _id = req.query.id;
  if (!_id) {
    return res.status(400).json({ message: "ID parameter is missing" });
  }
  const { assignSongs } = await Players.findOne({ _id });
  res.status(200).json({
    assignSongs,
    message: "Song fetched successfully",
  });
};

export const getSongByOnDutyPlayer = async (req, res, next) => {
  const onDuty = req.query.onDuty;
  if (!onDuty) {
    return res.status(400).json({ message: "onDuty parameter is missing" });
  }
  const data = await Players.find({ onDuty: onDuty });
  const response = new ResponseModel(true, "Songs fetched successfully", data);
  res.status(200).json({
    response,
  });
};
