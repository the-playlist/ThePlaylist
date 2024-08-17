import mongoose from "mongoose";
import Players from "../models/players";
import Songs from "../models/songs";
import ResponseModel from "./responseModel";
import Playlist from "../models/playlist";

export const addUpdateSong = async (req, res, next) => {
  const id = req?.body?.id;
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

export const markSongAsFav = async (req, res, next) => {
  const id = req?.body?.id;
  const isFav = req?.body?.isFav;
  if (id) {
    let song = await Songs.findByIdAndUpdate(
      id,
      { $set: { isFav: isFav } },
      { new: true }
    );
    let response = new ResponseModel(
      true,
      isFav ? "Song marked as favorite" : "Song marked as unfavorite",
      null
    );
    res.status(200).json(response);
  } else {
    return res.status(404).json({ message: "Song not found" });
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
          category: 1,
          introSec: 1,
          songDuration: 1,
          isDisabled: { $ifNull: ["$isDisabled", false] },
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

export const getAllFavSongs = async (req, res, next) => {
  let data;
  const { keyword, id } = req.query;
  if (keyword) {
    data = await Songs.find({ title: { $regex: new RegExp(keyword, "i") } });
  } else {
    let pipeline = [
      {
        $match: {
          isFav: true,
        },
      },
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
          category: 1,
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
        $unwind: "$player_info",
      },
      {
        $match: {
          $or: [{ isDisabled: false }, { isDisabled: { $exists: false } }],
        },
      },
      {
        $addFields: {
          duty: "$player_info.duty",
        },
      },
      {
        $group: {
          _id: "$_id",
          songName: { $first: "$songName" },
          artist: { $first: "$artist" },
          title: { $first: "$title" },
          isFav: { $first: "$isFav" },
          introSec: { $first: "$introSec" },
          songDuration: { $first: "$songDuration" },
          qualifiedCount: { $first: "$qualifiedCount" },
          maxStatus: { $max: "$duty.status" }, // Determine the highest status within each song group
        },
      },
      {
        $match: {
          maxStatus: true, // Filter only songs with the highest status being true
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
          qualifiedCount: 1,
        },
      },
    ];
    if (id) {
      pipeline.push({
        $match: { _id: new mongoose.Types.ObjectId(id) },
      });
    }

    data = await Songs.aggregate(pipeline);
  }
  const response = new ResponseModel(true, "Songs fetched successfully.", data);
  res.status(200).json(response);
};

export const getOnDutyAssignSongs = async (req, res, next) => {
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
          as: "assignedPlayers",
        },
      },
      {
        $unwind: "$assignedPlayers",
      },
      {
        $match: {
          "assignedPlayers.duty.status": true,
          $or: [{ isDisabled: false }, { isDisabled: { $exists: false } }],
        },
      },
      {
        $group: {
          _id: "$_id",
          isFav: { $first: "$isFav" },
          title: { $first: "$title" },
          artist: { $first: "$artist" },
          introSec: { $first: "$introSec" },
          songDuration: { $first: "$songDuration" },
          category: { $first: "$category" },
          assignedPlayers: {
            $push: {
              _id: "$assignedPlayers._id",
              playerName: {
                $concat: [
                  "$assignedPlayers.firstName",
                  " ",
                  "$assignedPlayers.lastName",
                ],
              },
            },
          },
        },
      },
      // Add this stage to flag comedy songs
      {
        $addFields: {
          isComedy: { $eq: ["$category", "Comedy"] },
        },
      },
      // Sort with comedy songs at the bottom
      {
        $sort: {
          isComedy: 1, // Non-comedy songs first
          title: 1, // Then sort by title if needed
        },
      },
    ];

    if (id) {
      pipeline.push({
        $match: { _id: new mongoose.Types.ObjectId(id) },
      });
    }
    data = await Songs.aggregate(pipeline);
  }
  const playlistCount = await Playlist.countDocuments({ isDeleted: false });
  const response = new ResponseModel(true, "Songs fetched successfully.", {
    list: data,
    playlistCount: playlistCount,
  });
  res.status(200).json(response);
};

export const deleteSongById = async (req, res, next) => {
  const id = req.query.id;
  if (!id) {
    return res.status(400).json({ message: "ID parameter is missing" });
  }

  await Songs.findByIdAndDelete(id);
  const songs = await Songs.find();
  const response = new ResponseModel(true, "Song Deleted Successfully.", null);
  res.status(200).json(response);
};

export const disableSongById = async (req, res, next) => {
  const id = req.body.id;
  const status = req.body.status;
  if (!id) {
    return res.status(400).json({ message: "ID parameter is missing" });
  }

  await Songs.findByIdAndUpdate(id, { isDisabled: status });
  const response = new ResponseModel(
    true,
    `Song ${status ? "disabled" : "activated"} successfully.`,
    null
  );
  res.status(200).json(response);
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

export const getOnDutyPlayerSongsForCustomer = async (req, res, next) => {
  try {
    const { keyword, id } = req.query;
    let data;

    if (keyword) {
      data = await Songs.find({ title: { $regex: new RegExp(keyword, "i") } });
    } else {
      let pipeline = [
        // Lookup players and unwind
        {
          $lookup: {
            from: "players",
            localField: "_id",
            foreignField: "assignSongs",
            as: "player_info",
          },
        },
        {
          $unwind: "$player_info",
        },
        // Add fields for player duty status
        {
          $addFields: {
            duty: "$player_info.duty",
          },
        },
        // Filter only on-duty players
        {
          $match: {
            "duty.status": true,
            $or: [{ isDisabled: false }, { isDisabled: { $exists: false } }],
          },
        },
        // Group by song and count the total players
        {
          $group: {
            _id: "$_id",
            songName: { $first: "$songName" },
            artist: { $first: "$artist" },
            title: { $first: "$title" },
            totalPlayers: { $sum: 1 },
          },
        },
        // Lookup playlist information
        {
          $lookup: {
            from: "playlists",
            localField: "_id",
            foreignField: "songData",
            as: "playlist_info",
          },
        },
        // Add a field to count playlist entries where isDeleted is false
        {
          $addFields: {
            playlistPlayers: {
              $size: {
                $filter: {
                  input: "$playlist_info",
                  as: "playlistItem",
                  cond: { $eq: ["$$playlistItem.isDeleted", false] },
                },
              },
            },
          },
        },
        // If playlist is not empty, filter out songs where playlistPlayers is greater than 0
        {
          $match: {
            $or: [
              { playlistPlayers: { $gt: 0 } }, // Songs in the playlist
              { playlistPlayers: { $eq: 0 }, totalPlayers: { $gt: 0 } }, // Songs not in the playlist but have other players who can sing
            ],
          },
        },
        // Project the final fields
        {
          $project: {
            _id: 1,
            songName: 1,
            artist: 1,
            title: 1,
            totalPlayers: 1,
            playlistPlayers: 1,
            difference: { $subtract: ["$totalPlayers", "$playlistPlayers"] },
          },
        },
        // If difference is not 0, show the song
        {
          $match: {
            difference: { $ne: 0 },
          },
        },
      ];

      data = await Songs.aggregate(pipeline);
    }

    const response = new ResponseModel(
      true,
      "Songs fetched successfully.",
      data
    );
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
