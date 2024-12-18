import { convertTimeToSeconds, formatTime } from "../utils/helper";

export const flattenPlaylist = (playlist) =>
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
      isFixed: item?.isFixed,
      applySwap: item?.applySwap,
      location: item?.songData?.location,
      requestToPerform: item?.requestToPerform,
      tableNo: item?.tableNo,
    };
  });

const queue = [];
let isProcessing = false;

const processQueue = async () => {
  if (isProcessing || queue.length === 0) return;

  isProcessing = true;

  const { resolve, reject, task } = queue.shift(); // Dequeue
  try {
    const result = await task();
    resolve(result); // Resolve the task promise
  } catch (error) {
    reject(error); // Reject the task promise
  } finally {
    isProcessing = false;
    processQueue(); // Process the next item in the queue
  }
};

export const addToQueue = (task) => {
  return new Promise((resolve, reject) => {
    queue.push({ task, resolve, reject });
    processQueue(); // Start processing
  });
};
