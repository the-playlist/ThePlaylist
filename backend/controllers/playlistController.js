import Song from "../models/songs";
import Playlist from "../models/playlist";
import Vote from "../models/votes";
import ResponseModel from "./responseModel";
import PlaylistType from "../models/playlistType";
import {
  songFromPlaylist,
  songsForTableView,
  songReports,
} from "../aggregation/playlist";
import { forEach, forIn } from "lodash";
import Players from "../models/players";
import mongoose from "mongoose";

export const addSongsToPlaylist = async (req, res, next) => {
  const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const songsWithExpiration = req.body.map((song) => ({
    ...song,
    expiresAt: expirationTime,
  }));

  const playlist = await Playlist.insertMany(songsWithExpiration);
  const response = new ResponseModel(
    true,
    "Songs added to playlist successfully.",
    playlist
  );
  res.status(201).json(response);
};

export const getSongsFromPlaylist = async (req, res, next) => {
  const playlist = await Playlist.aggregate(songFromPlaylist);
  const playlistCount = await Playlist.countDocuments({ isDeleted: false });

  const { isFavortiteListType } = await PlaylistType.findOne({
    _id: "662b7a6e80f2c908c92a0b3d",
  }).lean();
  // After populating, flatten the objects and rename properties
  let flattenedPlaylist = playlist.map((item) => ({
    _id: item._id,
    playerName: `${item?.assignedPlayer?.firstName} ${item?.assignedPlayer?.lastName}`,
    assignedPlayerId: item.assignedPlayer?._id,
    songId: item.songData._id,
    title: item.songData.title,
    artist: item.songData.artist,
    introSec: item.songData.introSec,
    songDuration: item.songData.songDuration,
    isFav: item.songData.isFav,
    dutyStatus: item?.assignedPlayer?.duty?.status,
    category: item.songData.category,
    upVote: item.upVoteCount,
    downVote: item.downVoteCount,
    sortOrder: item.sortOrder,
  }));

  if (isFavortiteListType) {
    flattenedPlaylist = flattenedPlaylist.filter((item) => item.isFav);
  }
  const response = new ResponseModel(true, "Songs fetched successfully.", {
    list: flattenedPlaylist,
    isFavortiteListType: isFavortiteListType,
    playlistCount, // Add playlistCount to the response object
  });
  res.status(200).json(response);
};
export const getSongsReportList = async (req, res, next) => {
  const songsList = await Song.aggregate(songReports);
  // After populating, flatten the objects and rename properties
  const response = new ResponseModel(
    true,
    "Songs fetched successfully.",
    songsList
  );
  res.status(200).json(response);
};
export const getSongsForTableView = async (req, res, next) => {
  const deviceId = req?.query?.id;
  const playlist = await Playlist.aggregate(songsForTableView);
  const { isFavortiteListType } = await PlaylistType.findOne({
    _id: "662b7a6e80f2c908c92a0b3d",
  }).lean();
  // After populating, flatten the objects and rename properties
  let flattenedPlaylist = playlist.map((item) => ({
    _id: item._id,
    playerName: `${item?.assignedPlayer?.firstName} ${item?.assignedPlayer?.lastName}`,
    assignedPlayerId: item.assignedPlayer?._id,
    songId: item.songData._id,
    title: item.songData.title,
    artist: item.songData.artist,
    introSec: item.songData.introSec,
    songDuration: item.songData.songDuration,
    isFav: item.songData.isFav,
    dutyStatus: item?.assignedPlayer?.duty?.status,
    category: item.songData.category,
    upVote: item.upVote,
    downVote: item.downVote,
    sortOrder: item.sortOrder,
  }));

  const votList = await Vote.find({ customerId: deviceId }).lean();
  if (votList.length > 0) {
    flattenedPlaylist.forEach((playlistItem) => {
      const matchingVote = votList.find(
        (voteItem) =>
          voteItem.playlistItemId?.toString() === playlistItem._id?.toString()
      );
      if (matchingVote) {
        playlistItem.upVote = matchingVote.isUpVote;
      }
    });
  }

  if (isFavortiteListType) {
    flattenedPlaylist = flattenedPlaylist.filter((item) => item.isFav);
  }
  const response = new ResponseModel(true, "Songs fetched successfully.", {
    list: flattenedPlaylist,
    isFavortiteListType: isFavortiteListType,
  });
  res.status(200).json(response);
};

export const updateSongsOrder = async (req, res, next) => {
  const songsList = req?.body?.songsList;
  for (const item of songsList) {
    await Playlist.updateOne(
      { _id: item.id },
      {
        $set: {
          sortOrder: item.newSortOrder,
        },
      }
    );
  }
  const response = new ResponseModel(
    true,
    "Order of Songs Updated Successfull",
    null
  );
  res.status(200).json(response);
};

export const deleteSongFromPlaylistById = async (req, res, next) => {
  const id = req.query.id;
  const isDeleted = req.query.isDeleted;
  if (!id) {
    return res.status(400).json({ message: "ID parameter is missing" });
  }
  await Playlist.findByIdAndUpdate(id, { isDeleted: isDeleted }, { new: true });
  const response = new ResponseModel(true, "List Updated Successfully.", null);
  res.status(200).json(response);
};

export const deleteAllSongsFromPlaylist = async (req, res, next) => {
  await Playlist.updateMany({ isDeleted: false }, { isDeleted: true });
  const response = new ResponseModel(true, "List Updated Successfully.", null);
  res.status(200).json(response);
};

export const undoDeleteSongsFromPlaylist = async (req, res, next) => {
  const songsIdList = req.body.data;
  if (songsIdList?.length) {
    songsIdList.forEach(async (element) => {
      await Playlist.updateOne({ _id: element }, { isDeleted: false });
    });
  }
  const response = new ResponseModel(true, "List Updated Successfully.", null);
  res.status(200).json(response);
};

function calculateExpirationTime() {
  const currentDate = new Date();
  const tomorrowDate = new Date(currentDate);
  tomorrowDate.setDate(currentDate.getDate() + 1);
  tomorrowDate.setHours(0, 0, 0, 0);
  return tomorrowDate;
}

export const addSongToPlaylistByCustomer = async (req, res) => {
  const { songId } = req.body;

  if (!songId) {
    return res.status(400).json({ message: "Song ID is required" });
  }
  try {
    // Fetch players assigned to the song and are on duty
    const players = await Players.aggregate([
      {
        $match: {
          assignSongs: new mongoose.Types.ObjectId(songId),
          "duty.status": true,
        },
      },
      {
        $lookup: {
          from: "playlists",
          localField: "_id",
          foreignField: "assignedPlayer",
          as: "playlistEntries",
          pipeline: [
            {
              $match: {
                songData: new mongoose.Types.ObjectId(songId),
                isDeleted: false,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          isInPlaylist: { $gt: [{ $size: "$playlistEntries" }, 0] },
        },
      },
      {
        $sort: { createdAt: 1 }, // Sort players by createdAt in ascending order
      },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          phone: 1,
          isInPlaylist: 1,
          playlistEntries: 1,
        },
      },
    ]);

    let playerToAssign = null;

    if (players.length > 0) {
      // Find a player who is not in the playlist
      playerToAssign = players.find((player) => !player.isInPlaylist);

      // If all players are already in the playlist, select the second player
      if (!playerToAssign) {
        // If the first and last players are the same, select the second player
        if (
          players.length > 1 &&
          players[0]._id.equals(players[players.length - 1]._id)
        ) {
          playerToAssign = players[1];
        } else {
          playerToAssign = players[0];
        }
      }
    }

    if (playerToAssign) {
      // Assign the song to this player
      const newPlaylistEntry = new Playlist({
        assignedPlayer: playerToAssign._id,
        songData: new mongoose.Types.ObjectId(songId),
        expiresAt: calculateExpirationTime(),
      });
      await newPlaylistEntry.save();
      const response = new ResponseModel(
        true,
        "Song added to playlist successfully",
        {
          message: `Song assigned to player ${playerToAssign.firstName} ${playerToAssign.lastName}`,
          player: playerToAssign,
        }
      );
      res.status(200).json(response);
    } else {
      res.status(200).json({
        message: "No players available to assign the song",
        players,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
