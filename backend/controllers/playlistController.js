import mongoose from "mongoose";
import Playlist from "../models/playlist";
import ResponseModel from "./responseModel";

export const addSongsToPlaylist = async (req, res, next) => {
  const playlist = await Playlist.insertMany(req.body);
  const response = new ResponseModel(
    true,
    "Songs added to playlist successfully.",
    playlist
  );
  res.status(201).json(response);
};

export const getSongsFromPlaylist = async (req, res, next) => {
  const playlist = await Playlist.find();
  const response = new ResponseModel(
    true,
    "Songs fetched successfully.",
    playlist
  );
  res.status(200).json(response);
};

export const deleteSongFromPlaylistById = async (req, res, next) => {
  const id = req.query.id;
  if (!id) {
    return res.status(400).json({ message: "ID parameter is missing" });
  }
  await Playlist.findByIdAndDelete(id);
  await Playlist.find();
  const response = new ResponseModel(true, "Song Deleted Successfully.", null);
  res.status(200).json(response);
};
