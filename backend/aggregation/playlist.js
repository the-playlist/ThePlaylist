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

// export const songFromPlaylistV2 = [
//   {
//     $match: { isDeleted: false }, // Match documents where isDeleted is false
//   },
//   {
//     $lookup: {
//       from: "songs", // Assuming the name of the collection is "songs"
//       localField: "songData",
//       foreignField: "_id",
//       as: "songData",
//     },
//   },
//   {
//     $unwind: "$songData", // Unwind the array if necessary
//   },
//   {
//     $lookup: {
//       from: "players", // Assuming the name of the collection is "players"
//       localField: "assignedPlayer",
//       foreignField: "_id",
//       as: "assignedPlayer",
//     },
//   },
//   {
//     $unwind: {
//       path: "$assignedPlayer", // Unwind the array if necessary
//       preserveNullAndEmptyArrays: true, // Include documents even if assignedPlayer is null
//     },
//   },
//   {
//     $match: {
//       $or: [
//         { "assignedPlayer.duty.status": true },
//         { assignedPlayer: { $eq: null } }, // Include documents where assignedPlayer is null
//       ],
//     }, // Filter documents based on assignedPlayer.duty.status
//   },
//   {
//     $project: {
//       _id: 1,
//       "songData.title": 1,
//       "songData.artist": 1,
//       "songData.introSec": 1,
//       "songData.location": 1,
//       "songData.songDuration": 1,
//       "songData.category": 1,
//       "songData.isFav": 1,
//       "songData._id": 1,
//       "assignedPlayer.firstName": 1,
//       "assignedPlayer.lastName": 1,
//       "assignedPlayer._id": 1,
//       "assignedPlayer.duty.status": 1,
//       sortOrder: 1,
//       upVote: 1,
//       downVote: 1,
//       sortOrder: 1,
//       sortByMaster: 1,
//       addByCustomer: 1,
//       qualifiedPlayers: 1,
//       isFixed: 1,
//       applySwap: 1,
//       requestToPerform: 1,
//       tableNo: 1,
//     },
//   },
//   {
//     $sort: { sortOrder: 1 }, // Sort the results
//   },
//   {
//     $lookup: {
//       from: "votes",
//       localField: "songData._id",
//       foreignField: "songId",
//       as: "VoteCountData",
//     },
//   },
//   {
//     $addFields: {
//       upVoteCount: {
//         $size: {
//           $filter: {
//             input: "$VoteCountData",
//             as: "vote",
//             cond: {
//               $and: [
//                 { $eq: ["$$vote.isUpVote", true] },
//                 { $eq: ["$$vote.playlistItemId", "$_id"] },
//               ],
//             },
//           },
//         },
//       },
//       downVoteCount: {
//         $size: {
//           $filter: {
//             input: "$VoteCountData",
//             as: "vote",
//             cond: {
//               $and: [
//                 { $eq: ["$$vote.isUpVote", false] },
//                 { $eq: ["$$vote.playlistItemId", "$_id"] },
//               ],
//             },
//           },
//         },
//       },
//     },
//   },
// ];
export const songFromPlaylistV2 = [
  {
    $match: { isDeleted: false }, // Filter deleted documents
  },
  {
    $lookup: {
      from: "songs",
      localField: "songData",
      foreignField: "_id",
      as: "songData",
      pipeline: [
        {
          $project: {
            title: 1,
            artist: 1,
            introSec: 1,
            location: 1,
            songDuration: 1,
            category: 1,
            isFav: 1,
            _id: 1,
          },
        },
      ], // Limit fields from songs
    },
  },
  {
    $unwind: "$songData", // Unwind if songData is an array
  },
  {
    $lookup: {
      from: "players",
      localField: "assignedPlayer",
      foreignField: "_id",
      as: "assignedPlayer",
      pipeline: [
        { $project: { firstName: 1, lastName: 1, _id: 1, "duty.status": 1 } },
      ], // Limit fields from players
    },
  },
  {
    $unwind: {
      path: "$assignedPlayer",
      preserveNullAndEmptyArrays: true, // Handle null assignedPlayer
    },
  },
  {
    $match: {
      $or: [
        { "assignedPlayer.duty.status": true },
        { assignedPlayer: { $eq: null } },
      ],
    }, // Filter by player duty status
  },
  {
    $project: {
      _id: 1,
      "songData.title": 1,
      "songData.artist": 1,
      "songData.introSec": 1,
      "songData.location": 1,
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
      sortByMaster: 1,
      addByCustomer: 1,
      qualifiedPlayers: 1,
      isFixed: 1,
      applySwap: 1,
      requestToPerform: 1,
      tableNo: 1,
    },
  },
  {
    $sort: { sortOrder: 1 }, // Sort by sortOrder
  },
  {
    $lookup: {
      from: "votes",
      let: { songId: "$songData._id", playlistItemId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$songId", "$$songId"] },
                { $eq: ["$playlistItemId", "$$playlistItemId"] },
              ],
            },
          },
        },
        { $project: { isUpVote: 1 } }, // Limit fields
      ],
      as: "VoteCountData",
    },
  },
  {
    $addFields: {
      upVoteCount: {
        $size: {
          $filter: {
            input: "$VoteCountData",
            cond: { $eq: ["$$this.isUpVote", true] },
          },
        },
      },
      downVoteCount: {
        $size: {
          $filter: {
            input: "$VoteCountData",
            cond: { $eq: ["$$this.isUpVote", false] },
          },
        },
      },
    },
  },
];

export const songsForTableViewV2 = [
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
    $unwind: {
      path: "$assignedPlayer", // Unwind the array if necessary
      preserveNullAndEmptyArrays: true, // Include documents even if assignedPlayer is null
    },
  },
  {
    $match: {
      $or: [
        { "assignedPlayer.duty.status": true },
        { assignedPlayer: { $eq: null } }, // Include documents where assignedPlayer is null
      ],
    },
  },
  {
    $project: {
      _id: 1,
      "songData.title": 1,
      "songData.artist": 1,
      "songData.introSec": 1,
      "songData.location": 1,
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
      isFixed: 1,
      applySwap: 1,
      requestToPerform: 1,
      tableNo: 1,
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

export const onDutyPlayersSongs = (oneHourAgo) => {
  const pipeline = [
    {
      $lookup: {
        from: "players",
        localField: "_id",
        foreignField: "assignSongs",
        as: "player_info",
      },
    },
    { $unwind: "$player_info" },
    { $addFields: { duty: "$player_info.duty" } },
    {
      $match: {
        "duty.status": true,
        $or: [{ isDisabled: false }, { isDisabled: { $exists: false } }],
      },
    },
    {
      $group: {
        _id: "$_id",
        songName: { $first: "$songName" },
        artist: { $first: "$artist" },
        title: { $first: "$title" },
        totalPlayers: { $sum: 1 },
        assignedPlayers: {
          $push: {
            _id: "$player_info._id",
            playerName: {
              $concat: ["$player_info.firstName", " ", "$player_info.lastName"],
            },
          },
        },
      },
    },
    {
      $lookup: {
        from: "playlistv2",
        localField: "_id",
        foreignField: "songData",
        as: "playlist_info",
      },
    },
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
        songAddedAt: {
          $max: "$playlist_info.songAddedAt",
        },
      },
    },
    {
      $match: {
        $and: [
          { playlistPlayers: { $eq: 0 } },
          {
            $or: [
              { songAddedAt: { $lte: oneHourAgo } },
              { songAddedAt: { $eq: null } },
            ],
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        songName: 1,
        artist: 1,
        title: 1,
        totalPlayers: 1,
        playlistPlayers: 1,
        songAddedAt: 1,
        assignedPlayers: 1,
        difference: { $subtract: ["$totalPlayers", "$playlistPlayers"] },
      },
    },
    {
      $match: {
        difference: { $ne: 0 },
      },
    },
  ];

  return pipeline;
};
