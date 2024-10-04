import ResponseModel from "./responseModel";
import ErrorModel from "../models/error"; // Assuming this is your error model

export const createError = async (req, res) => {
  const response = new ResponseModel(false, "", null);
  const { body } = req;

  try {
    // Validate request body if needed (e.g., check required fields)
    if (!body || Object.keys(body).length === 0) {
      response.description = "Request body is missing required fields.";
      return res.status(400).json(response);
    }

    // Attempt to create an error entry in the database
    const error = await ErrorModel.create(body);

    if (error) {
      response.description = "Error created successfully.";
      response.content = error;
      response.success = true;
      return res.status(201).json(response); // 201: Created
    } else {
      response.description = "Error could not be created.";
      response.content = [];
      return res.status(500).json(response); // 500: Internal server error
    }
  } catch (err) {
    // Handle any errors during the creation process
    response.description = "An error occurred while creating the error entry.";
    response.content = err.message || "Unknown error";
    return res.status(500).json(response); // 500: Internal server error
  }
};
