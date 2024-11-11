import mongoose from "mongoose";
import { convertTimeToSeconds, formatTime } from "../utils/helper";
import AsyncLock from "async-lock";

const lock = new AsyncLock();

export const withTransaction = async (apiLogic, req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await apiLogic(session);

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);

    res.status(500).json({ message: "Transaction failed. Please try again." });
  }
};

export const flattenPlaylist = (playlist) =>
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
      isFixed: item?.isFixed,
    };
  });

export const withLock = async (callback) => {
  const key = "playlistLock"; // Unique key for the lock, specific to your operations

  return lock.acquire(key, async () => {
    try {
      return await callback(); // Execute the provided callback function
    } catch (err) {
      console.error("Error in withLock:", err);
      throw err;
    }
  });
};
