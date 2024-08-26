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
import Players from "../models/players";
import mongoose from "mongoose";
import { convertTimeToSeconds, formatTime } from "../utils/helper";
import { playlistAlgorithm } from "../algorithm/playlistAlgo";

export const SETTING_ID = "662b7a6e80f2c908c92a0b3d";

export const addSongsToPlaylist = async (req, res, next) => {
  const result = await Playlist.find({ isDeleted: false });
  const playlistCount = result?.length;
  const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const songsWithExpiration = req.body.map((song, index) => ({
    ...song,
    expiresAt: expirationTime,
    sortOrder: playlistCount + index,
  }));

  const playlist = await Playlist.insertMany(songsWithExpiration);
  const list = await Playlist.aggregate(songFromPlaylist);
  const newIsFirstValue = result?.length == 0;
  await PlaylistType.updateOne(
    {
      _id: SETTING_ID, // updating one document to determine what type of list should be visible on Playlist
    },
    {
      $set: { isFirst: newIsFirstValue },
    },
    { new: true }
  );
  const { isFavortiteListType } = await PlaylistType.findOne({
    _id: SETTING_ID,
  }).lean();

  let flattenedPlaylist = list.map((item) => {
    const duration = convertTimeToSeconds(item?.songData?.songDuration);
    const introSec =
      item?.songData?.introSec == "" ? 0 : parseInt(item?.songData?.introSec);
    const totalDuration = formatTime(duration + introSec);
    return {
      _id: item._id,
      playerName: `${item?.assignedPlayer?.firstName} ${item?.assignedPlayer?.lastName}`,
      assignedPlayerId: item.assignedPlayer?._id,
      songId: item.songData._id,
      title: item.songData.title,
      artist: item.songData.artist,
      introSec: item?.songData?.introSec == "" ? 0 : item?.songData?.introSec,
      songDuration: totalDuration,
      isFav: item.songData.isFav,
      dutyStatus: item?.assignedPlayer?.duty?.status,
      category: item.songData.category,
      tableUpVote: item.upVote,
      tableDownVote: item.downVote,
      upVote: item.upVoteCount,
      downVote: item.downVoteCount,
      sortOrder: item.sortOrder,
      sortByMaster: item?.sortByMaster,
      addByCustomer: item.addByCustomer,
    };
  });
  if (isFavortiteListType) {
    flattenedPlaylist = flattenedPlaylist.filter((item) => item.isFav);
  }
  const finalPlaylist = playlistAlgorithm(newIsFirstValue, flattenedPlaylist);
  const bulkOps = finalPlaylist.map((item, index) => ({
    updateOne: {
      filter: { _id: item?._id },
      update: { $set: { sortOrder: index } },
    },
  }));

  await Playlist.bulkWrite(bulkOps);
  const response = new ResponseModel(
    true,
    "Songs added to playlist successfully.",
    {
      isFavortiteListType: isFavortiteListType,
      playlist: finalPlaylist,
      isFirstTimeFetched: newIsFirstValue,
    }
  );
  res.status(201).json(response);
};

export const getSongsFromPlaylist = async (req, res, next) => {
  const firstFetch = req?.query?.isFirstTimeFetched;

  const { isFirst: isFirstTimeFetched, isFavortiteListType } =
    await PlaylistType.findOne({
      _id: SETTING_ID,
    }).lean();

  const playlist = await Playlist.aggregate(songFromPlaylist);
  const playlistCount = await Playlist.countDocuments({ isDeleted: false });

  const flattenPlaylist = (playlist) =>
    playlist.map((item) => {
      const duration = convertTimeToSeconds(item?.songData?.songDuration);
      const introSec = item?.songData?.introSec || 0;
      const totalDuration = formatTime(duration + parseInt(introSec));

      return {
        _id: item._id,
        playerName: `${item?.assignedPlayer?.firstName} ${item?.assignedPlayer?.lastName}`,
        assignedPlayerId: item.assignedPlayer?._id,
        songId: item.songData._id,
        title: item.songData.title,
        artist: item.songData.artist,
        introSec,
        songDuration: totalDuration,
        isFav: item.songData.isFav,
        dutyStatus: item?.assignedPlayer?.duty?.status,
        category: item.songData.category,
        tableUpVote: item.upVote,
        tableDownVote: item.downVote,
        upVote: item.upVoteCount,
        downVote: item.downVoteCount,
        sortOrder: item.sortOrder,
        sortByMaster: item?.sortByMaster,
        addByCustomer: item.addByCustomer,
      };
    });

  let flattenedPlaylist = flattenPlaylist(playlist);

  if (isFavortiteListType) {
    flattenedPlaylist = flattenedPlaylist.filter((item) => item.isFav);
  }

  const finalPlaylist = playlistAlgorithm(
    firstFetch ?? isFirstTimeFetched,
    flattenedPlaylist
  );

  const updatedSongs = finalPlaylist.map((song, index) => ({
    ...song,
    sortOrder: index,
  }));

  await Promise.all(
    updatedSongs.map((song) =>
      Playlist.updateOne(
        { _id: song._id },
        { $set: { sortOrder: song.sortOrder } }
      )
    )
  );

  const newFlattenedPlaylist = flattenPlaylist(
    await Playlist.aggregate(songFromPlaylist)
  );

  const filteredPlaylist = isFavortiteListType
    ? newFlattenedPlaylist.filter((item) => item.isFav)
    : newFlattenedPlaylist;

  res.status(200).json(
    new ResponseModel(true, "Songs fetched successfully.", {
      playlist: filteredPlaylist,
      isFavortiteListType,
      playlistCount,
      isFirstTimeFetched,
    })
  );
};

const today = new Date();
const startOfWeek = getMonday(today);
const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // First day of this month

function getMonday(date) {
  const day = date.getDay();
  const diff = day === 0 ? 6 : day - 1;
  const monday = new Date(date);
  monday.setDate(date.getDate() - diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export const getSongsReportList = async (req, res, next) => {
  const { reportType } = req?.query;

  let filterByDate = {};
  if (reportType == 0) {
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    filterByDate = {
      "votesDetails.createdAt": {
        $gte: startOfDay,
      },
    };
  } else if (reportType == 1) {
    filterByDate = { "votesDetails.createdAt": { $gte: startOfWeek } }; // Filter for songs created this week
  } else if (reportType == 2) {
    filterByDate = { "votesDetails.createdAt": { $gte: startOfMonth } }; // Filter for songs created this month
  }

  const songsList = await Song.aggregate(songReports(filterByDate));
  const response = new ResponseModel(
    true,
    "Songs fetched successfully.",
    songsList
  );
  res.status(200).json(response);
};

export const getSongsForTableView = async (req, res, next) => {
  const { id: deviceId, firstFetch } = req?.body;

  const { isFirst: isFirstTimeFetched, isFavortiteListType } =
    await PlaylistType.findOne({
      _id: SETTING_ID,
    }).lean();

  const playlist = await Playlist.aggregate(songsForTableView);
  const votList = await Vote.find({ customerId: deviceId }).lean();
  const voteLookup = votList.reduce((acc, vote) => {
    acc[vote.playlistItemId?.toString()] = vote.isUpVote;
    return acc;
  }, {});

  const flattenPlaylist = (playlist) =>
    playlist.map((item) => {
      const vote = voteLookup[item._id?.toString()];
      return {
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
        tableUpVote: vote !== undefined ? vote : item.upVote,

        tableDownVote: item.downVote,
        upVote: item.upVoteCount,
        downVote: item.downVoteCount,
        sortOrder: item.sortOrder,
        sortByMaster: item.sortByMaster,
        addByCustomer: item.addByCustomer,
      };
    });

  let flattenedPlaylist = flattenPlaylist(playlist);

  if (isFavortiteListType) {
    flattenedPlaylist = flattenedPlaylist.filter((item) => item.isFav);
  }

  const finalPlaylist = playlistAlgorithm(
    firstFetch ?? isFirstTimeFetched,
    flattenedPlaylist
  );

  const updatedSongs = finalPlaylist.map((song, index) => ({
    ...song,
    sortOrder: index,
  }));

  await Promise.all(
    updatedSongs.map((song) =>
      Playlist.updateOne(
        { _id: song._id },
        { $set: { sortOrder: song.sortOrder } }
      )
    )
  );

  let newFlattenedPlaylist = flattenPlaylist(
    await Playlist.aggregate(songsForTableView)
  );

  if (isFavortiteListType) {
    newFlattenedPlaylist = newFlattenedPlaylist.filter((item) => item.isFav);
  }

  res.status(200).json(
    new ResponseModel(true, "Songs fetched successfully.", {
      list: newFlattenedPlaylist,
      isFavortiteListType,
      isFirstTimeFetched,
    })
  );
};

export const updateSongsOrder = async (req, res, next) => {
  const songsList = req?.body?.songsList;
  for (const item of songsList) {
    await Playlist.updateOne(
      { _id: item.id },
      {
        $set: {
          sortOrder: item.newSortOrder,
          sortByMaster: item.sortByMaster,
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

export const revertMasterCheck = async (req, res, next) => {
  const item = req?.body?.item;
  const result = await Playlist.updateOne(
    { _id: item._id },
    {
      $set: {
        sortOrder: item.sortOrder,
        sortByMaster: item.sortByMaster,
      },
    }
  );

  if (result.nModified === 0) {
    return res
      .status(404)
      .json(new ResponseModel(false, "Item not found or no changes made"));
  }

  const response = new ResponseModel(
    true,
    "Playlist item updated successfully",
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
  const activeSongs = await Playlist.find({ isDeleted: false });
  if (activeSongs?.length === 1) {
    await PlaylistType.updateOne(
      {
        _id: SETTING_ID, // updating one document to determine what type of list should be visible on Playlist
      },
      {
        $set: { isFirst: true },
      }
    );
  }
  const response = new ResponseModel(true, "List Updated Successfully.", null);
  res.status(200).json(response);
};

// export const deleteSongFromPlaylistById = async (req, res, next) => {
//   const id = req.query.id;
//   if (!id) {
//     return res.status(400).json({ message: "ID parameter is missing" });
//   }

//   // Delete the record by ID
//   await Playlist.findByIdAndDelete(id);

//   // Find active songs
//   const activeSongs = await Playlist.find({ isDeleted: false });

//   // If there's only one active song, update PlaylistType
//   if (activeSongs?.length === 1) {
//     await PlaylistType.updateOne(
//       {
//         _id: SETTING_ID, // updating one document to determine what type of list should be visible on Playlist
//       },
//       {
//         $set: { isFirst: true },
//       }
//     );
//   }

//   // Respond with success
//   const response = new ResponseModel(true, "List Updated Successfully.", null);
//   res.status(200).json(response);
// };

export const deleteAllSongsFromPlaylist = async (req, res, next) => {
  await Playlist.updateMany({ isDeleted: false }, { isDeleted: true });
  await PlaylistType.updateOne(
    {
      _id: SETTING_ID, // updating one document to determine what type of list should be visible on Playlist
    },
    {
      $set: { isFirst: true },
    },
    { new: true }
  );
  const response = new ResponseModel(true, "List Updated Successfully.", null);
  res.status(200).json(response);
};

// export const deleteAllSongsFromPlaylist = async (req, res, next) => {
//   try {
//     // Delete all documents where isDeleted is false
//     await Playlist.deleteMany({ isDeleted: false });

//     // Optionally update PlaylistType if needed
//     await PlaylistType.updateOne(
//       {
//         _id: SETTING_ID, // updating one document to determine what type of list should be visible on Playlist
//       },
//       {
//         $set: { isFirst: true },
//       },
//       { new: true }
//     );

//     // Respond with success
//     const response = new ResponseModel(
//       true,
//       "All songs deleted and list updated successfully.",
//       null
//     );
//     res.status(200).json(response);
//   } catch (error) {
//     // Handle errors
//     next(error);
//   }
// };

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
  const { songId, addByCustomer } = req.body;
  const result = await Playlist.find({ isDeleted: false });
  if (!songId) {
    return res.status(400).json({ message: "Song ID is required" });
  }
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

  if (players?.length > 0) {
    // Find a player who is not in the playlist
    playerToAssign = players.find((player) => !player.isInPlaylist);

    // If all players are already in the playlist, select the second player
    if (!playerToAssign) {
      // If the first and last players are the same, select the second player
      if (
        players?.length > 1 &&
        players[0]._id.equals(players[players?.length - 1]._id)
      ) {
        playerToAssign = players[1];
      } else {
        // playerToAssign = players[0];
        return res
          .status(400)
          .json(new ResponseModel(false, "Song Already exist in the playlist"));
      }
    }
  }

  if (playerToAssign) {
    const playlistCount = await Playlist.countDocuments({
      isDeleted: false,
    });
    const newPlaylistEntry = new Playlist({
      assignedPlayer: playerToAssign._id,
      songData: new mongoose.Types.ObjectId(songId),
      addByCustomer: addByCustomer,
      expiresAt: calculateExpirationTime(),
      sortOrder: playlistCount,
    });
    await newPlaylistEntry.save();
    const list = await Playlist.aggregate(songFromPlaylist);
    const { isFavortiteListType } = await PlaylistType.findOne({
      _id: SETTING_ID,
    }).lean();

    let flattenedPlaylist = list.map((item) => {
      const duration = convertTimeToSeconds(item?.songData?.songDuration);
      const introSec =
        item?.songData?.introSec == "" ? 0 : parseInt(item?.songData?.introSec);
      const totalDuration = formatTime(duration + introSec);
      return {
        _id: item._id,
        playerName: `${item?.assignedPlayer?.firstName} ${item?.assignedPlayer?.lastName}`,
        assignedPlayerId: item.assignedPlayer?._id,
        songId: item.songData._id,
        title: item.songData.title,
        artist: item.songData.artist,
        introSec: item?.songData?.introSec == "" ? 0 : item?.songData?.introSec,
        songDuration: totalDuration,
        isFav: item.songData.isFav,
        dutyStatus: item?.assignedPlayer?.duty?.status,
        category: item.songData.category,
        tableUpVote: item.upVote,
        tableDownVote: item.downVote,
        upVote: item.upVoteCount,
        downVote: item.downVoteCount,
        sortOrder: item.sortOrder,
        sortByMaster: item?.sortByMaster,
        addByCustomer: item.addByCustomer,
      };
    });
    if (isFavortiteListType) {
      flattenedPlaylist = flattenedPlaylist.filter((item) => item.isFav);
    }
    const finalPlaylist = playlistAlgorithm(
      result?.length == 0 ? true : false,
      flattenedPlaylist
    );
    const response = new ResponseModel(
      true,
      "Song added to playlist successfully",
      {
        message: `Song assigned to player ${playerToAssign.firstName} ${playerToAssign.lastName}`,
        player: playerToAssign,
        isFirstTimeFetched: result?.length > 0 ? false : true,
        playlist: finalPlaylist,
      }
    );
    res.status(200).json(response);
  } else {
    res.status(200).json({
      message: "No players available to assign the song",
      players,
    });
  }
};

export const isPlaylistEmpty = async (req, res, next) => {
  const result = await Playlist.find({ isDeleted: false });
  const response = new ResponseModel(true, "Data Fetched successfully.", {
    isFirstTimeFetched: result?.length == 0 ? true : false,
  });
  res.status(201).json(response);
};
