import Players from "../models/players";
import ResponseModel from "./responseModel";

export const getAllStaff = async (req, res, next) => {
  const players = await Players.find().select("firstName lastName duty");
  const response = new ResponseModel(
    true,
    "Staff fetched successfully",
    players
  );
  res.status(200).json(response);
};

export const updateDutyStatus = async (req, res, next) => {
  try {
    const updates = req.body;
    const responseMessages = [];
    for (const { id, status, startTime } of updates) {
      const filter = { _id: id };
      const update = {
        $set: { "duty.status": status, "duty.startTime": startTime },
      };
      const updatedPlayer = await Players.findOneAndUpdate(filter, update, {
        new: true,
      });

      if (updatedPlayer) {
        responseMessages.push(
          `Status updated successfully for player with ID ${id}`
        );
      } else {
        responseMessages.push(
          `Player with ID ${id} not found or already has status=true`
        );
      }
    }

    res.status(200).json({ success: true, messages: responseMessages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
