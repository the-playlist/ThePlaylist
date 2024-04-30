import Playlist from "../models/playlist";
import ResponseModel from "./responseModel";
import PlaylistType from "../models/playlistType";

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
  const playlist = await Playlist.aggregate([
    {
      $match: { isDeleted: false }, // Match documents where isDeleted is false
    },
    {
      $lookup: {
        from: "songs", // Assuming the name of the collection is "songs"
        localField: "songData",
        foreignField: "_id",
        as: "songData",
      },
    },
    {
      $unwind: "$songData", // Unwind the array if necessary
    },
    {
      $lookup: {
        from: "players", // Assuming the name of the collection is "players"
        localField: "assignedPlayer",
        foreignField: "_id",
        as: "assignedPlayer",
      },
    },
    {
      $unwind: "$assignedPlayer", // Unwind the array if necessary
    },
    {
      $match: { "assignedPlayer.duty.status": true }, // Filter documents based on assignedPlayer.duty.status
    },
    {
      $project: {
        _id: 1,
        "songData.title": 1,
        "songData.artist": 1,
        "songData.introSec": 1,
        "songData.songDuration": 1,
        "songData.category": 1,
        "songData.isFav": 1,
        "songData._id": 1,
        "assignedPlayer.firstName": 1,
        "assignedPlayer.lastName": 1,
        "assignedPlayer._id": 1,
        "assignedPlayer.duty.status": 1,
        sortOrder: 1,
        upVote: 1,
        downVote: 1,
        sortOrder: 1,
      },
    },
    {
      $sort: { sortOrder: 1 }, // Sort the results
    },
  ]);
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
  if (!id) {
    return res.status(400).json({ message: "ID parameter is missing" });
  }
  await Playlist.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  await Playlist.find();
  const response = new ResponseModel(true, "List Updated Successfully.", null);
  res.status(200).json(response);
};
