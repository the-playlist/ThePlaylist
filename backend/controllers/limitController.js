import Limit from "../models/limits";
import ResponseModel from "./responseModel";

export const addUpdateLimit = async (req, res) => {
  const { body } = req;
  const { heading } = body || {};
  const existingLimit = await Limit.findOne({ heading });
  if (existingLimit) {
    const updatedLimit = await Limit.findOneAndUpdate({ heading }, body, {
      new: true,
    });
    return res
      .status(200)
      .json(
        new ResponseModel(true, "Limit updated successfully", updatedLimit)
      );
  }
  const newLimit = await Limit.create(body);
  return res
    .status(201)
    .json(new ResponseModel(true, "Limit added successfully", newLimit));
};

export const getLimitList = async (req, res) => {
  const response = await Limit.find().sort({ sortOrder: 1 }).lean();
  return res
    .status(201)
    .json(new ResponseModel(true, "Limit added successfully", response));
};

export const getLimitByTitle = async (req, res) => {
  const { heading } = req?.query || {};
  const limit = await Limit.findOne({ heading });
  return res
    .status(200)
    .json(new ResponseModel(true, "Limit retrieved successfully", limit));
};
