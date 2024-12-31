import mongoose from "mongoose";
import Players from "../models/players";
import Songs from "../models/songs";
import ResponseModel from "./responseModel";
import Playlist from "../models/playlist";
import {
  onDutyPlayersSongs,
  songFromPlaylist,
  songFromPlaylistV2,
} from "../aggregation/playlist";
import { convertTimeToSeconds, formatTime } from "@/app/_utils/helper";
import PlaylistType from "../models/playlistType";
import { SETTING_ID } from "./playlistController";
import PlaylistV2 from "../models/playlistV2";
import { flattenPlaylist } from "./helper";

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
          location: 1,
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
    // let pipeline = [
    //   {
    //     $lookup: {
    //       from: "players",
    //       localField: "_id",
    //       foreignField: "assignSongs",
    //       as: "assignedPlayers",
    //     },
    //   },
    //   {
    //     $unwind: "$assignedPlayers",
    //   },
    //   {
    //     $match: {
    //       "assignedPlayers.duty.status": true,
    //       $or: [{ isDisabled: false }, { isDisabled: { $exists: false } }],
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: "$_id",
    //       isFav: { $first: "$isFav" },
    //       title: { $first: "$title" },
    //       artist: { $first: "$artist" },
    //       introSec: { $first: "$introSec" },
    //       songDuration: { $first: "$songDuration" },
    //       category: { $first: "$category" },
    //       assignedPlayers: {
    //         $push: {
    //           _id: "$assignedPlayers._id",
    //           playerName: {
    //             $concat: [
    //               "$assignedPlayers.firstName",
    //               " ",
    //               "$assignedPlayers.lastName",
    //             ],
    //           },
    //         },
    //       },
    //     },
    //   },
    //   // Add this stage to flag comedy songs
    //   {
    //     $addFields: {
    //       isComedy: { $eq: ["$category", "Comedy"] },
    //     },
    //   },
    //   // Sort with comedy songs at the bottom
    //   {
    //     $sort: {
    //       isComedy: 1, // Non-comedy songs first
    //       title: 1, // Then sort by title if needed
    //     },
    //   },
    // ];

    let pipeline = [
      // Lookup players and unwind
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
      // Filter only on-duty players
      {
        $match: {
          "assignedPlayers.duty.status": true,
          $or: [{ isDisabled: false }, { isDisabled: { $exists: false } }],
        },
      },
      // Group by song and push assigned players
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
      // Filter out songs that are already in the playlist (playlistPlayers > 0)
      {
        $match: {
          playlistPlayers: { $eq: 0 }, // Only return songs that are not in the playlist
        },
      },
      // Flag comedy songs
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
      // let pipeline = [
      //   // Lookup players and unwind
      //   {
      //     $lookup: {
      //       from: "players",
      //       localField: "_id",
      //       foreignField: "assignSongs",
      //       as: "player_info",
      //     },
      //   },
      //   {
      //     $unwind: "$player_info",
      //   },
      //   // Add fields for player duty status
      //   {
      //     $addFields: {
      //       duty: "$player_info.duty",
      //     },
      //   },
      //   // Filter only on-duty players
      //   {
      //     $match: {
      //       "duty.status": true,
      //       $or: [{ isDisabled: false }, { isDisabled: { $exists: false } }],
      //     },
      //   },
      //   // Group by song and count the total players
      //   {
      //     $group: {
      //       _id: "$_id",
      //       songName: { $first: "$songName" },
      //       artist: { $first: "$artist" },
      //       title: { $first: "$title" },
      //       totalPlayers: { $sum: 1 },
      //     },
      //   },
      //   // Lookup playlist information
      //   {
      //     $lookup: {
      //       from: "playlists",
      //       localField: "_id",
      //       foreignField: "songData",
      //       as: "playlist_info",
      //     },
      //   },
      //   // Add a field to count playlist entries where isDeleted is false
      //   {
      //     $addFields: {
      //       playlistPlayers: {
      //         $size: {
      //           $filter: {
      //             input: "$playlist_info",
      //             as: "playlistItem",
      //             cond: { $eq: ["$$playlistItem.isDeleted", false] },
      //           },
      //         },
      //       },
      //     },
      //   },
      //   // If playlist is not empty, filter out songs where playlistPlayers is greater than 0
      //   {
      //     $match: {
      //       $or: [
      //         { playlistPlayers: { $gt: 0 } }, // Songs in the playlist
      //         { playlistPlayers: { $eq: 0 }, totalPlayers: { $gt: 0 } }, // Songs not in the playlist but have other players who can sing
      //       ],
      //     },
      //   },
      //   // Project the final fields
      //   {
      //     $project: {
      //       _id: 1,
      //       songName: 1,
      //       artist: 1,
      //       title: 1,
      //       totalPlayers: 1,
      //       playlistPlayers: 1,
      //       difference: { $subtract: ["$totalPlayers", "$playlistPlayers"] },
      //     },
      //   },
      //   // If difference is not 0, show the song
      //   {
      //     $match: {
      //       difference: { $ne: 0 },
      //     },
      //   },
      // ];
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
        // Filter out songs that exist in the playlist (playlistPlayers > 0)
        {
          $match: {
            playlistPlayers: { $eq: 0 }, // Only songs that are not in the playlist
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

export const getOnDutyAssignSongsV2 = async (req, res, next) => {
  let data;
  const { keyword, id } = req.query;
  // Get the time threshold for songs added within the last hour
  const oneHourAgo = new Date(Date.now() - 3600 * 1000);
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
          as: "assignedPlayers",
        },
      },
      {
        $unwind: "$assignedPlayers",
      },
      // Filter only on-duty players
      {
        $match: {
          "assignedPlayers.duty.status": true,
          $or: [{ isDisabled: false }, { isDisabled: { $exists: false } }],
        },
      },
      // Group by song and push assigned players
      {
        $group: {
          _id: "$_id",
          isFav: { $first: "$isFav" },
          title: { $first: "$title" },
          artist: { $first: "$artist" },
          introSec: { $first: "$introSec" },
          location: { $first: "$location" },
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
      // Lookup playlist information
      {
        $lookup: {
          from: "playlistv2",
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
          // Add the latest added date from the playlist for the song
          songAddedAt: {
            $max: "$playlist_info.songAddedAt", // Assuming playlistAddedAt stores when the song was added to the playlist
          },
        },
      },
      // Filter out songs that are already in the playlist (playlistPlayers > 0)
      {
        $match: {
          $and: [
            { playlistPlayers: { $eq: 0 } }, // Only return songs that are not in the playlist
            {
              $or: [
                { songAddedAt: { $lte: oneHourAgo } }, // Song was added more than an hour ago
                { songAddedAt: { $eq: null } }, // Song was never added to the playlist
              ],
            },
          ],
        },
      },
      // Flag comedy songs
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
  const playlistCount = await PlaylistV2.countDocuments({ isDeleted: false });
  const response = new ResponseModel(true, "Songs fetched successfully.", {
    list: data,
    playlistCount: playlistCount,
  });
  res.status(200).json(response);
};

export const getOnDutyPlayerSongsForCustomerV2 = async (req, res, next) => {
  try {
    const { keyword, id } = req.query;
    let data;

    // Get the time threshold for songs added within the last hour
    const oneHourAgo = new Date(Date.now() - 3600 * 1000);
    if (keyword) {
      data = await Songs.find({ title: { $regex: new RegExp(keyword, "i") } });
    } else {
      data = await Songs.aggregate(onDutyPlayersSongs(oneHourAgo));
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

export const managePlaylist = async (req, res, next) => {
  let playlistCount = await PlaylistV2.countDocuments({
    isDeleted: false,
  });

  // Step 1: Check if the playlist already has 30 or more entries
  if (playlistCount >= 30) {
    return res
      .status(400)
      .json(
        new ResponseModel(
          false,
          "The playlist already has 30 or more songs.",
          null
        )
      );
  }

  // While the playlist count is less than 30, keep adding songs
  while (playlistCount < 30) {
    const { keyword, id } = req.query;
    let data;

    // Get the time threshold for songs added within the last hour
    const oneHourAgo = new Date(Date.now() - 3600 * 1000);

    if (keyword) {
      data = await Songs.find({ title: { $regex: new RegExp(keyword, "i") } });
    } else {
      data = await Songs.aggregate(onDutyPlayersSongs(oneHourAgo));
    }

    // Step 2: Aggregate data to get assignedPlayerIds with counts
    const assignedPlayerIds = await PlaylistV2.aggregate([
      { $match: { assignedPlayer: { $ne: null }, isDeleted: false } },
      { $group: { _id: "$assignedPlayer", count: { $sum: 1 } } },
      { $sort: { count: 1 } },
    ]);

    // Step 3: Create a mapping of assignedPlayer counts
    const assignedPlayerMap = new Map(
      assignedPlayerIds.map(({ _id, count }) => [_id.toString(), count])
    );

    // Step 4: Fetch all active players
    const players = await Players.find({ "duty.status": true }, { _id: 1 });

    // Step 5: Filter players not in assignedPlayerIds or with lower counts
    let filteredPlayers = players.filter((player) => {
      const playerId = player._id.toString();
      return (
        !assignedPlayerMap.has(playerId) || assignedPlayerMap.get(playerId) < 1
      );
    });

    // Step 6: Sort players by priority
    const allPlayersInMap = filteredPlayers.length === 0;
    if (allPlayersInMap) {
      filteredPlayers = players.sort((a, b) => {
        const aId = a._id.toString();
        const bId = b._id.toString();

        const aCount = assignedPlayerMap.has(aId)
          ? assignedPlayerMap.get(aId)
          : Infinity;
        const bCount = assignedPlayerMap.has(bId)
          ? assignedPlayerMap.get(bId)
          : Infinity;

        return aCount - bCount;
      });
    }

    // Step 7: Fallback to return a random player if no match is found
    if (filteredPlayers.length === 0) {
      const randomIndex = Math.floor(Math.random() * players.length);
      filteredPlayers = [players[randomIndex]]; // Pick a random player
    }

    // Step 8: Select the player (first from filtered list)
    const lastPlaylistItem = await PlaylistV2.findOne()
      .sort({ sortOrder: -1 }) // Sort by sortOrder in descending order to get the last item
      .exec();
    const lastAssignedPlayerId = lastPlaylistItem
      ? lastPlaylistItem.assignedPlayer.toString()
      : null;
    let filteredPlayersWithoutLastAssigned = filteredPlayers.filter(
      (player) => {
        return player._id.toString() !== lastAssignedPlayerId;
      }
    );

    const selectedPlayer =
      filteredPlayersWithoutLastAssigned?.length > 0
        ? filteredPlayersWithoutLastAssigned[0]
        : null;

    // Step 9: Extract the player ID
    const onDutyPlayerIds = selectedPlayer ? [selectedPlayer._id] : [];

    // Step 10: Filter the songs based on assignedPlayers._id matching with onDutyPlayerIds
    const filteredSongs = data.filter((song) => {
      return song.assignedPlayers.some((player) =>
        onDutyPlayerIds.some((onDutyId) => onDutyId.equals(player._id))
      );
    });

    let selectedSong = null;
    if (filteredSongs.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredSongs.length);
      selectedSong = filteredSongs[randomIndex];
    } else {
      throw new Error("No songs available to assign.");
    }

    // Step 11: Create the playlist entry for the selected song
    const newPlaylistEntry = new PlaylistV2({
      assignedPlayer: selectedPlayer._id,
      songData: new mongoose.Types.ObjectId(selectedSong._id),
      addByCustomer: false,
      sortOrder: playlistCount, // Add at the end of the playlist
      qualifiedPlayers: selectedSong?.assignedPlayers.map((player) => ({
        id: player?._id,
        name: player?.playerName,
      })),
    });

    await newPlaylistEntry.save();

    // Increment the playlist count for the next iteration
    playlistCount++;

    // If we've reached 30, break the loop
    if (playlistCount >= 30) {
      break;
    }
  }
  const [playlistType, playlist, count] = await Promise.all([
    PlaylistType.findOne({ _id: SETTING_ID }).lean(),

    PlaylistV2.aggregate(songFromPlaylistV2),
    PlaylistV2.countDocuments({ isDeleted: false }),
  ]);
  const { isFirst: isFirstTimeFetched, isFavortiteListType } = playlistType;
  let flattenedPlaylist = flattenPlaylist(playlist);

  if (isFavortiteListType) {
    flattenedPlaylist = flattenedPlaylist.filter((item) => item.isFav);
  }
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
      playlistCount: count,
      isFavortiteListType,
      completeList: filteredPlaylist,
    })
  );
};
