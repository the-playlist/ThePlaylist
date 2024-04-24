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
  const playlist = await Playlist.find({ isDeleted: false })
    .sort({ sortOrder: 1 })
    .lean();
  const response = new ResponseModel(
    true,
    "Songs fetched successfully.",
    playlist
  );
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
