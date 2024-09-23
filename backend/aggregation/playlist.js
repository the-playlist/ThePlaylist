export const songsForTableView = [
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
      sortByMaster: 1,
      addByCustomer: 1,
    },
  },
  {
    $sort: { sortOrder: 1 }, // Sort the results
  },
  {
    $lookup: {
      from: "votes",
      localField: "songData._id",
      foreignField: "songId",
      as: "VoteCountData",
    },
  },
  {
    $addFields: {
      upVoteCount: {
        $size: {
          $filter: {
            input: "$VoteCountData",
            as: "vote",
            cond: {
              $and: [
                { $eq: ["$$vote.isUpVote", true] },
                { $eq: ["$$vote.playlistItemId", "$_id"] },
              ],
            },
          },
        },
      },
      downVoteCount: {
        $size: {
          $filter: {
            input: "$VoteCountData",
            as: "vote",
            cond: {
              $and: [
                { $eq: ["$$vote.isUpVote", false] },
                { $eq: ["$$vote.playlistItemId", "$_id"] },
              ],
            },
          },
        },
      },
    },
  },
];

export const songFromPlaylist = [
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
      sortByMaster: 1,
      addByCustomer: 1,
      qualifiedPlayers: 1,
    },
  },
  {
    $sort: { sortOrder: 1 }, // Sort the results
  },
  {
    $lookup: {
      from: "votes",
      localField: "songData._id",
      foreignField: "songId",
      as: "VoteCountData",
    },
  },
  {
    $addFields: {
      upVoteCount: {
        $size: {
          $filter: {
            input: "$VoteCountData",
            as: "vote",
            cond: {
              $and: [
                { $eq: ["$$vote.isUpVote", true] },
                { $eq: ["$$vote.playlistItemId", "$_id"] },
              ],
            },
          },
        },
      },
      downVoteCount: {
        $size: {
          $filter: {
            input: "$VoteCountData",
            as: "vote",
            cond: {
              $and: [
                { $eq: ["$$vote.isUpVote", false] },
                { $eq: ["$$vote.playlistItemId", "$_id"] },
              ],
            },
          },
        },
      },
    },
  },
];

export const songReports = (filterByDate) => {
  const report = [
    {
      $lookup: {
        from: "votes",
        localField: "_id",
        foreignField: "songId",
        as: "votesDetails",
      },
    },
    {
      $match: filterByDate,
    },
    {
      $addFields: {
        upVoteCount: {
          $size: {
            $filter: {
              input: "$votesDetails",
              as: "vote",
              cond: {
                $eq: ["$$vote.isUpVote", true],
              },
            },
          },
        },
        downVoteCount: {
          $size: {
            $filter: {
              input: "$votesDetails",
              as: "vote",
              cond: {
                $eq: ["$$vote.isUpVote", false],
              },
            },
          },
        },
      },
    },
    {
      $project: {
        votesDetails: 0,
      },
    },
    {
      $sort: {
        upVoteCount: -1,
        downVoteCount: -1,
      },
    },
  ];
  return report;
};

export const songFromPlaylistV2 = [
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
      sortByMaster: 1,
      addByCustomer: 1,
      qualifiedPlayers: 1,
      isFixed: 1,
    },
  },
  {
    $sort: { sortOrder: 1 }, // Sort the results
  },
  {
    $lookup: {
      from: "votes",
      localField: "songData._id",
      foreignField: "songId",
      as: "VoteCountData",
    },
  },
  {
    $addFields: {
      upVoteCount: {
        $size: {
          $filter: {
            input: "$VoteCountData",
            as: "vote",
            cond: {
              $and: [
                { $eq: ["$$vote.isUpVote", true] },
                { $eq: ["$$vote.playlistItemId", "$_id"] },
              ],
            },
          },
        },
      },
      downVoteCount: {
        $size: {
          $filter: {
            input: "$VoteCountData",
            as: "vote",
            cond: {
              $and: [
                { $eq: ["$$vote.isUpVote", false] },
                { $eq: ["$$vote.playlistItemId", "$_id"] },
              ],
            },
          },
        },
      },
    },
  },
];
