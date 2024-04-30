import Vote from "../models/votes";
import ResponseModel from "./responseModel";

export const addUpdateVote = async (req, res, next) => {
  console.log(req);
  const body = req?.body;
  debugger;
  const playlistItemId = req?.body?.playlistItemId;
  const vote = Vote.findOne({ playlistItemId: playlistItemId });
  if (vote) {
    await Vote.updateOne(
      { _id: vote._id },
      {
        $set: {
          isUpVote: body.isUpVote,
        },
      }
    );
  } else {
    await Vote.create({
      customerId: body.customerId,
      songId: body.songId,
      playlistItemId: body.playlistItemId,
      playerId: body.playerId,
      isUpVote: body.isUpVote,
    });
  }
  let response = new ResponseModel(true, "Vote added Successfully", players);
  res.status(200).json(response);
};
