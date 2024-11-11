import { songFromPlaylistV2 } from "../aggregation/playlist";
import AlgorithmStatus from "../models/algorithStatus";
import PlaylistV2 from "../models/playlistV2";
import Vote from "../models/votes";
import { flattenPlaylist } from "./helper";
import { algoStatusId } from "./playlistController";
import ResponseModel from "./responseModel";

const voteHandlerV2 = async (
  customerId,
  playlistItemId,
  isUpVote,
  playerId,
  songId,
  res
) => {
  await AlgorithmStatus.findByIdAndUpdate(
    algoStatusId,
    {
      isApplied: true,
    },
    {
      new: true,
    }
  );
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

export const addUpdateVoteV2 = async (req, res, next) => {
  const { songId, songDetail, isUpVote, customerId, playerId, playlistItemId } =
    req?.body;

  const list = await PlaylistV2.aggregate(songFromPlaylistV2);
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
      return voteHandlerV2(
        customerId,
        playlistItemId,
        isUpVote,
        playerId,
        songId,
        res
      );
    }, timeout);
  } else {
    return voteHandlerV2(
      customerId,
      playlistItemId,
      isUpVote,
      playerId,
      songId,
      res
    );
  }
};

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
