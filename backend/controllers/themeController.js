import Theme from "../models/viewsTheme";
import ResponseModel from "./responseModel";

export const addUpdateTheme = async (req, res) => {
  const { body } = req;
  const { title } = body || {};
  const existingTheme = await Theme.findOne({ title });
  if (existingTheme) {
    const updatedTheme = await Theme.findOneAndUpdate({ title }, body, {
      new: true,
    });
    return res
      .status(200)
      .json(
        new ResponseModel(true, "Theme updated successfully", updatedTheme)
      );
  }
  const newTheme = await Theme.create(body);
  return res
    .status(201)
    .json(new ResponseModel(true, "Theme added successfully", newTheme));
};

export const getThemeList = async (req, res) => {
  const response = await Theme.find().lean();
  return res
    .status(201)
    .json(new ResponseModel(true, "Theme added successfully", response));
};

export const getThemeByTitle = async (req, res) => {
  const { title } = req?.query || {};
  const theme = await Theme.findOne({ title });
  return res
    .status(200)
    .json(new ResponseModel(true, "Theme retrieved successfully", theme));
};
