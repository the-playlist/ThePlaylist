import Vote from "../models/votes";
import ResponseModel from "./responseModel";
import { flattenPlaylist } from "./helper";
import { songFromPlaylist } from "../aggregation/playlist";
import Playlist from "../models/playlist";

const voteHandler = async (
  customerId,
  playlistItemId,
  isUpVote,
  playerId,
  songId,
  res
) => {
  const vote = await Vote.findOne({
    $and: [
      {
        playlistItemId: playlistItemId,
        customerId: customerId,
      },
    ],
  });
  if (vote) {
    await Vote.updateOne(
      { _id: vote._id },
      {
        $set: {
          isUpVote: isUpVote,
        },
      }
    );
  } else {
    await Vote.create({
      customerId: customerId,
      songId: songId,
      playlistItemId: playlistItemId,
      playerId: playerId,
      isUpVote: isUpVote,
    });
  }
  let response = new ResponseModel(true, "Vote added Successfully", null);
  res.status(200).json(response);
};

export const addUpdateVote = async (req, res, next) => {
  const { songId, songDetail, isUpVote, customerId, playerId, playlistItemId } =
    req?.body;

  const list = await Playlist.aggregate(songFromPlaylist);
  const flattenedPlaylist = flattenPlaylist(list);
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
      return voteHandler(
        customerId,
        playlistItemId,
        isUpVote,
        playerId,
        songId,
        res
      );
    }, timeout);
  } else {
    return voteHandler(
      customerId,
      playlistItemId,
      isUpVote,
      playerId,
      songId,
      res
    );
  }
};
