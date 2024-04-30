import Vote from "../models/votes";
import ResponseModel from "./responseModel";

export const addUpdateVote = async (req, res, next) => {
  const body = req?.body;
  const playlistItemId = req?.body?.playlistItemId;
  const vote = await Vote.findOne({ playlistItemId: playlistItemId });
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

  let response = new ResponseModel(true, "Vote added Successfully", null);
  res.status(200).json(response);
};
