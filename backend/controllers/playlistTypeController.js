import PlaylistType from "../models/playlistType";
import ResponseModel from "./responseModel";

export const updateTypeToPlaylist = async (req, res, next) => {
  const playlist = await PlaylistType.updateOne(
    {
      _id: "662b7a6e80f2c908c92a0b3d", // updating one document to determine what type of list should be visible on Playlist
    },
    {
      $set: { isFavortiteListType: req.body.isFavortiteListType },
    }
  );
  const response = new ResponseModel(
    true,
    "Playlisttype updated successfully",
    playlist
  );
  res.status(201).json(response);
};
