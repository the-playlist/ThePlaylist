import Song from "../models/songs";
import Playlist from "../models/playlist";
import Vote from "../models/votes";
import ResponseModel from "./responseModel";
import PlaylistType from "../models/playlistType";
import Limit from "../models/limits";
import {
  songFromPlaylist,
  songsForTableView,
  songReports,
  songFromPlaylistV2,
  songsForTableViewV2,
} from "../aggregation/playlist";
import Players from "../models/players";
import mongoose from "mongoose";
import { convertTimeToSeconds, formatTime } from "../utils/helper";
import {
  playlistAlgorithm,
  playlistAlgorithmV2,
} from "../algorithm/playlistAlgo";
import { flattenPlaylist } from "./helper";
import AlgorithmStatus from "../models/algorithStatus";
import PlaylistV2 from "../models/playlistV2";
import { MdContactSupport } from "react-icons/md";

export const SETTING_ID = "662b7a6e80f2c908c92a0b3d";
export const algoStatusId = "6728794712916c8fc48542c3";

export const updatePlayerName = async (req, res, next) => {
  const playlistItemId = req.body.playlistItemId;
  const assignedPlayerId = req.body.assignedPlayerID;
  await Playlist.findByIdAndUpdate(playlistItemId, {
    assignedPlayer: assignedPlayerId,
  });
  const response = new ResponseModel(
    true,
    "Player Name updated  playlist successfully.",
    null
  );
  res.status(200).json(response);
};
export const addSongsToPlaylist = async (req, res, next) => {
  const result = await Playlist.find({ isDeleted: false });
  const playlistCount = result?.length;
  const expirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const songsWithExpiration = req.body.map((song, index) => ({
    ...song,
    expiresAt: expirationTime,
    sortOrder: playlistCount + index,
    qualifiedPlayers: song.qualifiedPlayers.map((player) => ({
      id: player?._id,
      name: player?.playerName,
    })),
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
    // const totalDuration = formatTime(duration + introSec);
    const totalDuration = formatTime(duration);
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
      // const totalDuration = formatTime(duration + parseInt(introSec));
      const totalDuration = formatTime(duration);
      return {
        _id: item._id,
        playerName: `${item?.assignedPlayer?.firstName} ${item?.assignedPlayer?.lastName}`,
        assignedPlayerId: item.assignedPlayer?._id,
        qualifiedPlayers: item?.qualifiedPlayers,
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
  const playlist = await Playlist.aggregate(songFromPlaylist);
  const flattenPlaylist = (playlist) =>
    playlist.map((item) => {
      const duration = convertTimeToSeconds(item?.songData?.songDuration);
      const introSec = item?.songData?.introSec || 0;
      const totalDuration = formatTime(duration + parseInt(introSec));

      return {
        _id: item._id,
        playerName: `${item?.assignedPlayer?.firstName} ${item?.assignedPlayer?.lastName}`,
        assignedPlayerId: item.assignedPlayer?._id,
        qualifiedPlayers: item?.qualifiedPlayers,
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

  const updatedSongs = flattenedPlaylist.map((song, index) => ({
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

const addSongHandler = async (songId, addByCustomer, result, res) => {
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

    let flattenedPlaylist = flattenPlaylist(list);
    if (isFavortiteListType) {
      flattenedPlaylist = flattenedPlaylist.filter((item) => item.isFav);
    }

    const finalPlaylist = playlistAlgorithm(
      result?.length == 0 ? true : false,
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

    const response = new ResponseModel(
      true,
      "Song added to playlist successfully",
      {
        message: `Song assigned to player ${playerToAssign.firstName} ${playerToAssign.lastName}`,
        player: playerToAssign,
        isFirstTimeFetched: result?.length > 0 ? false : true,
        playlist: filteredPlaylist,
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

export const addSongToPlaylistByCustomer = async (req, res) => {
  const { songId, addByCustomer, songDetail } = req.body;
  const result = await Playlist.aggregate(songFromPlaylist);
  const flattenedPlaylist = flattenPlaylist(result);
  const songAtTop = flattenedPlaylist
    ?.filter((song, index) => index == 0)
    .map((song) => song.songId);

  if (!songId) {
    return res.status(400).json({ message: "Song ID is required" });
  }
  const isEqual = songAtTop.toString() === songId;

  const delay = songDetail?.duration + 1;
  const timeout = delay * 1000;

  if (
    isEqual &&
    songDetail?.playingState == true &&
    songDetail?.duration < delay
  ) {
    setTimeout(() => {
      return addSongHandler(songId, addByCustomer, result, res);
    }, timeout);
  } else {
    return addSongHandler(songId, addByCustomer, result, res);
  }
};

export const isPlaylistEmpty = async (req, res, next) => {
  const result = await Playlist.find({ isDeleted: false });
  const response = new ResponseModel(true, "Data Fetched successfully.", {
    isFirstTimeFetched: result?.length == 0 ? true : false,
  });
  res.status(201).json(response);
};

function filterAndSortSongs(songs, predicate, sortField) {
  return songs.filter(predicate).sort((a, b) => a[sortField] - b[sortField]);
}

function mapSongsWithSortOrder(songs) {
  return songs.map((song, index) => ({
    ...song,
    sortOrder: index,
    isFixed: index < 2,
    addByCustomer: false,
    applySwap: false,
  }));
}

async function updateSongsInDatabase(songs) {
  await Promise.all(
    songs.map((song) =>
      PlaylistV2.updateOne(
        { _id: song._id },
        {
          $set: {
            sortOrder: song.sortOrder,
            isFixed: song.isFixed,
            addByCustomer: false,
            applySwap: false,
          },
        }
      )
    )
  );
}

export const getSongsFromPlaylistV2 = async (req, res, next) => {
  try {
    const firstFetch = req?.query?.isFirstTimeFetched;

    const [playlistType, status, playlist, playlistCount] = await Promise.all([
      PlaylistType.findOne({ _id: SETTING_ID }).lean(),
      AlgorithmStatus.findById(algoStatusId, "isApplied").lean(),
      PlaylistV2.aggregate(songFromPlaylistV2),
      PlaylistV2.countDocuments({ isDeleted: false }),
    ]);

    const { isFirst: isFirstTimeFetched, isFavortiteListType } = playlistType;
    let flattenedPlaylist = flattenPlaylist(playlist);

    if (isFavortiteListType) {
      flattenedPlaylist = flattenedPlaylist.filter((item) => item.isFav);
    }

    const tempNonFix = flattenedPlaylist.filter((item) => !item.isFixed);
    const [secondLastSong, lastSong] = tempNonFix.slice(-2);

    if (
      status?.isApplied ||
      lastSong?.playerName == secondLastSong?.playerName
    ) {
      // const finalPlaylist = flattenedPlaylist;
      const finalPlaylist = playlistAlgorithmV2(
        firstFetch ?? isFirstTimeFetched,
        flattenedPlaylist
      );

      const updatedSongs = mapSongsWithSortOrder(finalPlaylist);
      await updateSongsInDatabase(updatedSongs);

      const newFlattenedPlaylist = flattenPlaylist(
        await PlaylistV2.aggregate(songFromPlaylistV2)
      );

      const filteredPlaylist = isFavortiteListType
        ? newFlattenedPlaylist.filter((item) => item.isFav)
        : newFlattenedPlaylist;

      const isFixedItems = filteredPlaylist?.filter(
        (item) => item?.isFixed == true
      );

      const isNotFixedItems = filteredPlaylist?.filter(
        (item) => !item?.isFixed
      );

      res.status(200).json(
        new ResponseModel(true, "Songs fetched successfully.", {
          isFixedItems: isFixedItems,
          isNotFixed: isNotFixedItems,
          playlistCount,
          isFavortiteListType,
          completeList: filteredPlaylist,
        })
      );
      await AlgorithmStatus.findByIdAndUpdate(
        algoStatusId,
        { isApplied: false },
        { new: true }
      );
    } else {
      const filteredPlaylist = isFavortiteListType
        ? flattenedPlaylist?.filter((item) => item.isFav)
        : flattenedPlaylist;
      const isFixedItems = filteredPlaylist?.filter(
        (item) => item?.isFixed == true
      );
      const isNotFixedItems = filteredPlaylist?.filter(
        (item) => !item?.isFixed
      );

      res.status(200).json(
        new ResponseModel(true, "Songs fetched successfully.", {
          isFixedItems: isFixedItems,
          isNotFixed: isNotFixedItems,
          playlistCount,
          isFavortiteListType,
          completeList: filteredPlaylist,
        })
      );
    }
  } catch (error) {
    console.log("==>", error);
  }
};

export const getSongsForTableViewV2 = async (req, res, next) => {
  const { id: deviceId, firstFetch } = req?.body;
  const status = await AlgorithmStatus.findById(
    algoStatusId,
    "isApplied"
  ).lean();
  const { isFirst: isFirstTimeFetched, isFavortiteListType } =
    await PlaylistType.findOne({
      _id: SETTING_ID,
    }).lean();

  const playlist = await PlaylistV2.aggregate(songsForTableViewV2);
  const votList = await Vote.find({ customerId: deviceId }).lean();
  const voteLookup = votList?.reduce((acc, vote) => {
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
        isFixed: item?.isFixed,
        applySwap: item?.applySwap,
        location: item?.songData?.location,
        requestToPerform: item?.requestToPerform,
        tableNo: item?.tableNo,
      };
    });

  let flattenedPlaylist = flattenPlaylist(playlist);

  if (isFavortiteListType) {
    flattenedPlaylist = flattenedPlaylist.filter((item) => item.isFav);
  }
  if (status?.isApplied) {
    const finalPlaylist = playlistAlgorithmV2(false, flattenedPlaylist);
    const updatedSongs = finalPlaylist.map((song, index) => ({
      ...song,
      sortOrder: index,
    }));
    await Promise.all(
      updatedSongs.map((song) =>
        PlaylistV2.updateOne(
          { _id: song._id },
          {
            $set: {
              sortOrder: song.sortOrder,
              isFixed:
                song.sortOrder === 0 || song.sortOrder === 1 ? true : false,
              addByCustomer: false,
              applySwap: false,
            },
          }
        )
      )
    );

    let newFlattenedPlaylist = flattenPlaylist(
      await PlaylistV2.aggregate(songsForTableViewV2)
    );
    if (isFavortiteListType) {
      newFlattenedPlaylist = newFlattenedPlaylist.filter((item) => item.isFav);
    }
    const isFixedItems = newFlattenedPlaylist?.filter(
      (item) => item?.isFixed == true
    );

    const isNotFixedItems = newFlattenedPlaylist?.filter(
      (item) => !item?.isFixed
    );

    res.status(200).json(
      new ResponseModel(true, "Songs fetched successfully.", {
        list: newFlattenedPlaylist,
        isFavortiteListType,
        isFirstTimeFetched,
        isFixedItems: isFixedItems,
        isNotFixed: isNotFixedItems,
      })
    );
    await AlgorithmStatus.findByIdAndUpdate(
      algoStatusId,
      {
        isApplied: false,
      },
      {
        new: true,
      }
    );
  } else {
    const filteredPlaylist = isFavortiteListType
      ? flattenedPlaylist?.filter((item) => item.isFav)
      : flattenedPlaylist;
    const isFixedItems = filteredPlaylist?.filter(
      (item) => item?.isFixed == true
    );
    const isNotFixedItems = filteredPlaylist?.filter((item) => !item?.isFixed);

    res.status(200).json(
      new ResponseModel(true, "Songs fetched successfully.", {
        isFixedItems: isFixedItems,
        isNotFixed: isNotFixedItems,
        isFirstTimeFetched,
        isFavortiteListType,
        list: filteredPlaylist,
      })
    );
  }
};

export const addSongsToPlaylistV2 = async (req, res, next) => {
  const result = await PlaylistV2.find({ isDeleted: false });
  const playlistCount = result?.length;

  const songsWithExpiration = req.body.map((song, index) => ({
    ...song,
    sortOrder: playlistCount + index,
    qualifiedPlayers: song.qualifiedPlayers.map((player) => ({
      id: player?._id,
      name: player?.playerName,
    })),
  }));

  const playlist = await PlaylistV2.insertMany(songsWithExpiration);
  await AlgorithmStatus.findByIdAndUpdate(
    algoStatusId,
    {
      isApplied: true,
    },
    {
      new: true,
    }
  );
  const response = new ResponseModel(
    true,
    "Songs Added To Playlist Successfully",
    playlist
  );
  res.status(201).json(response);
};

export const deleteAllSongsFromPlaylistV2 = async (req, res, next) => {
  await PlaylistV2.deleteMany({});
  await AlgorithmStatus.findByIdAndUpdate(
    algoStatusId,
    {
      isApplied: true,
    },
    {
      new: true,
    }
  );
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

export const updatePlayerNameV2 = async (req, res, next) => {
  const playlistItemId = req.body.playlistItemId;
  const assignedPlayerId = req.body.assignedPlayerID;
  await AlgorithmStatus.findByIdAndUpdate(
    algoStatusId,
    {
      isApplied: true,
    },
    {
      new: true,
    }
  );
  await PlaylistV2.findByIdAndUpdate(playlistItemId, {
    assignedPlayer: assignedPlayerId,
  });
  const response = new ResponseModel(
    true,
    "Player Name updated  playlist successfully.",
    null
  );
  res.status(200).json(response);
};

export const updateSongsOrderV2 = async (req, res, next) => {
  const songsList = req?.body?.songsList;
  for (const item of songsList) {
    await PlaylistV2.updateOne(
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

export const revertMasterCheckV2 = async (req, res, next) => {
  const item = req?.body?.item;
  await AlgorithmStatus.findByIdAndUpdate(
    algoStatusId,
    {
      isApplied: true,
    },
    {
      new: true,
    }
  );
  const result = await PlaylistV2.updateOne(
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

export const deleteSongFromPlaylistByIdV2 = async (req, res, next) => {
  const id = req.query.id;
  const isDeleted = req.query.isDeleted;
  const isAuto = req?.query.auto == "true" || false;
  const hideSong = req?.query.hideSong === "true";
  const dateTime = new Date();
  if (isAuto) {
    await AlgorithmStatus.findByIdAndUpdate(
      algoStatusId,
      {
        isApplied: true,
      },
      {
        new: true,
      }
    );
  }
  if (!id) {
    return res.status(400).json({ message: "ID parameter is missing" });
  }

  await PlaylistV2.findByIdAndUpdate(
    id,
    {
      isDeleted: isDeleted,
      isFixed: false,
      songAddedAt: hideSong ? dateTime : null,
    },
    { new: true }
  );
  const playlist = await PlaylistV2.aggregate(songFromPlaylistV2);
  if (playlist?.length === 1) {
    await PlaylistType.updateOne(
      {
        _id: SETTING_ID,
      },
      {
        $set: { isFirst: true },
      }
    );
  }

  let flattenedPlaylist = flattenPlaylist(playlist);
  const updatedSongs = flattenedPlaylist.map((song, index) => ({
    ...song,
    sortOrder: index,
  }));
  await Promise.all(
    updatedSongs.map((song) =>
      PlaylistV2.updateOne(
        { _id: song._id },
        {
          $set: {
            sortOrder: song.sortOrder,
            isFixed:
              song.sortOrder === 0 || song.sortOrder === 1 ? true : false,
          },
        }
      )
    )
  );

  const response = new ResponseModel(true, "List Updated Successfully.", null);
  res.status(200).json(response);
};

const addSongHandlerV2 = async (
  songId,
  addByCustomer,
  res,
  qualifiedPlayers,
  count
) => {
  const players = await Players.aggregate([
    {
      $match: {
        assignSongs: new mongoose.Types.ObjectId(songId),
        "duty.status": true,
      },
    },
    {
      $lookup: {
        from: "playlistv2",
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
  let playlistCount;
  if (playerToAssign) {
    playlistCount = await PlaylistV2.countDocuments({
      isDeleted: false,
    });
    const newPlaylistEntry = new PlaylistV2({
      assignedPlayer: playerToAssign._id,
      songData: new mongoose.Types.ObjectId(songId),
      addByCustomer: addByCustomer,
      sortOrder: count ? count : playlistCount,
      qualifiedPlayers: qualifiedPlayers.map((player) => ({
        id: player?._id,
        name: player?.playerName,
      })),
    });
    await newPlaylistEntry.save();
    const list = await PlaylistV2.aggregate(songFromPlaylistV2);

    let flattenedPlaylist = flattenPlaylist(list);
    const foundSong = flattenedPlaylist.find(
      (song) => song.songId.toString() === songId.toString()
    );

    const response = new ResponseModel(
      true,
      "Song added to playlist successfully",
      {
        message: `Song assigned to player ${playerToAssign.firstName} ${playerToAssign.lastName}`,
        player: playerToAssign,
        song: foundSong,
        list: flattenedPlaylist,
        playlistCount: playlistCount,
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

export const addSongToPlaylistByCustomerV2 = async (req, res) => {
  const { songId, addByCustomer, songDetail, qualifiedPlayers } = req.body;
  const list = await PlaylistV2.aggregate(songFromPlaylistV2);
  const flattenedPlaylist = flattenPlaylist(list);

  const delay = songDetail?.duration + 1;
  const timeout = delay * 1000;

  if (songDetail?.playingState == true && songDetail?.duration < delay) {
    setTimeout(() => {
      return addSongHandlerV2(songId, addByCustomer, res, qualifiedPlayers);
    }, timeout);
  } else {
    return addSongHandlerV2(songId, addByCustomer, res, qualifiedPlayers);
  }
};

export const addMultipleSongsToPlaylistV2 = async (req, res) => {
  let payload = req.body;

  if (!Array.isArray(payload) || payload.length === 0) {
    return res
      .status(400)
      .json({ message: "An array of song IDs is required" });
  }
  const playlistCount = await PlaylistV2.countDocuments({
    isDeleted: false,
  });
  payload?.map(async (item, index) => {
    addSongHandlerV2(
      item?.songId,
      false,
      res,
      item?.qualifiedPlayers,
      playlistCount + index
    );
  });
};

const createPlaylistEntry = async (
  songId,
  tableNo,
  requestToPerform,
  finalSortOrder
) => {
  const payload = {
    assignedPlayer: null,
    songData: new mongoose.Types.ObjectId(songId),
    addByCustomer: false,
    sortOrder: finalSortOrder,
    qualifiedPlayers: null,
    requestToPerform: requestToPerform,
    tableNo: tableNo,
  };

  await PlaylistV2.create(payload);
};

const calculateFinalSortOrder = async (lastPerformRequestItem) => {
  const currentSortOrder = lastPerformRequestItem?.sortOrder || 0;
  // const nextSortOrder = Math.ceil(currentSortOrder / 3) * 3 + 2;
  let nextSortOrder;
  if (currentSortOrder == 0) {
    nextSortOrder = currentSortOrder + 2; // Maintain a difference of 3
  } else {
    nextSortOrder = currentSortOrder + 3; // Maintain a difference of 3
  }

  const maxSortOrderItem = await PlaylistV2.find()
    .sort({ sortOrder: -1 })
    .limit(1)
    .lean();

  const maxSortOrder = maxSortOrderItem?.sortOrder || 0;

  const finalSortOrder =
    nextSortOrder <= maxSortOrder ? maxSortOrder + 1 : nextSortOrder;

  await PlaylistV2.updateMany(
    { sortOrder: { $gte: nextSortOrder } },
    { $inc: { sortOrder: 1 } }
  );

  return finalSortOrder;
};

export const requestToPerformSong = async (req, res) => {
  try {
    const { songId, requestToPerform, tableNo } = req.body;
    const heading = "Perform Request Limit";
    const { value, time } = await Limit.findOne({ heading }).lean();

    // Get the earliest entry
    const earliestEntry = await PlaylistV2.findOne({
      tableNo,
      isDeleted: false,
    })
      .sort({ requestTime: 1 })
      .lean();

    const canAddSong = async () => {
      const lastPerformRequestItem = await PlaylistV2.findOne({
        requestToPerform: true,
        isDeleted: false,
      })
        .sort({ sortOrder: -1 })
        .lean();

      const finalSortOrder = await calculateFinalSortOrder(
        lastPerformRequestItem
      );
      await createPlaylistEntry(
        songId,
        tableNo,
        requestToPerform,
        finalSortOrder
      );

      return new ResponseModel(
        true,
        "Song added and playlist updated successfully",
        { lastPerformRequestItem }
      );
    };

    if (earliestEntry) {
      const requestTime = new Date(earliestEntry.requestTime);
      const differenceInMilliseconds = Math.abs(
        Date.now() - requestTime.getTime()
      );
      const differenceInMinutes = differenceInMilliseconds / (1000 * 60);

      const checkRequestToPerform = await PlaylistV2.countDocuments({
        tableNo,
        isDeleted: false,
      });

      if (checkRequestToPerform < value && differenceInMinutes < time) {
        const response = await canAddSong();
        return res.status(200).json(response);
      } else {
        return res
          .status(403)
          .json(
            new ResponseModel(
              false,
              "Song cannot be added at this moment, please try again later.",
              null
            )
          );
      }
    } else {
      const response = await canAddSong();
      return res.status(200).json(response);
    }
  } catch (error) {
    console.error("Error in requestToPerformSong:", error);
    return res.status(500).json(
      new ResponseModel(false, "Internal Server Error", {
        error: error.message,
      })
    );
  }
};
