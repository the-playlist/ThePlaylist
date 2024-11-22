import Location from "../models/location";
import ResponseModel from "./responseModel";

export const addUpdateLocation = async (req, res, next) => {
  const { symbol, standsFor } = req?.body;
  const alreadyExist = await Location.findOne({
    $or: [{ symbol: symbol }, { standsFor: standsFor }],
  });
  if (alreadyExist) {
    let response = new ResponseModel(
      true,
      "Location already exists successfully",
      null
    );
    res.status(200).json(response);
  } else {
    const location = await Location.create(req.body);
    let response = new ResponseModel(
      true,
      "Location added successfully",
      location
    );
    res.status(200).json(response);
  }
};

export const getLocationList = async (req, res) => {
  const response = await Location.find().lean();
  return res
    .status(201)
    .json(new ResponseModel(true, "Limit added successfully", response));
};
