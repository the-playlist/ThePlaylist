import { convertTimeToSeconds, formatTime } from "../utils/helper";

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
    };
  });
