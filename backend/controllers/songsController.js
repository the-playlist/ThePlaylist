import mongoose from "mongoose";
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
  const { keyword, id } = req.query;
  if (keyword) {
    data = await Songs.find({ title: { $regex: new RegExp(keyword, "i") } });
  } else {
    let pipeline = [
      {
        $lookup: {
          from: "players", // Assuming the collection name for players is "players"
          localField: "_id",
          foreignField: "assignSongs",
          as: "qualifiedPlayers",
        },
      },
      {
        $addFields: {
          qualifiedCount: { $size: "$qualifiedPlayers" },
        },
      },

      {
        $project: {
          // This function is used to structure our resulted Document Object which fields should be included in Data set and which should be ignored 1 for inclusion and 0 for deletion
          _id: 1, // Include the _id of the song
          songName: 1, // Include the name of the song
          artist: 1, // Include other song details you want
          title: 1,
          isFav: 1,
          introSec: 1,
          songDuration: 1,
          qualifiedPlayers: {
            $map: {
              input: "$qualifiedPlayers",
              as: "player",
              in: {
                fullname: {
                  $concat: ["$$player.firstName", " ", "$$player.lastName"],
                },
              },
            },
          },
          qualifiedCount: 1,
        },
      },
    ];
    if (id) {
      if (id) {
        pipeline.push({
          $match: { _id: new mongoose.Types.ObjectId(id) },
        });
      }
    }

    data = await Songs.aggregate(pipeline);
  }
  const response = new ResponseModel(true, "Songs fetched successfully.", data);
  res.status(200).json(response);
};

export const getOnDutyPlayerSongs = async (req, res, next) => {
  let data;
  const { keyword, id } = req.query;
  if (keyword) {
    data = await Songs.find({ title: { $regex: new RegExp(keyword, "i") } });
  } else {
    let pipeline = [
      {
        $lookup: {
          from: "players",
          localField: "_id",
          foreignField: "assignSongs",
          as: "player_info",
        },
      },
      {
        $addFields: {
          duty: { $arrayElemAt: ["$player_info.duty", 0] },
        },
      },
      {
        $match: {
          "duty.status": true,
        },
      },
      {
        $project: {
          _id: 1,
          songName: 1,
          artist: 1,
          title: 1,
          isFav: 1,
          introSec: 1,
          songDuration: 1,
          duty: 1,
          qualifiedCount: 1,
        },
      },
    ];
    if (id) {
      if (id) {
        pipeline.push({
          $match: { _id: new mongoose.Types.ObjectId(id) },
        });
      }
    }

    data = await Songs.aggregate(pipeline);
  }
  const response = new ResponseModel(true, "Songs fetched successfully.", data);
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
