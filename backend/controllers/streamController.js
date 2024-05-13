import Stream from "../models/streaming";
import ResponseModel from "./responseModel";
import { StreamChat } from "stream-chat";

export const sendStreamRequest = async (req, res, next) => {
  const { streamId, userId, isTrue } = req?.body;
  const request = await Stream.create({ streamId, userId, isTrue });
  let response = new ResponseModel(true, "Player added successfully", request);
  res.status(200).json(response);
};

export const getStreamRequest = async (req, res, next) => {
  const requestList = await Stream.find({ isActive: true });

  const response = new ResponseModel(
    true,
    "Songs fetched successfully.",
    requestList
  );
  res.status(200).json(response);
};

export const deleteStreamRequest = async (req, res, next) => {
  const { id } = req.query;
  const requestList = await Stream.findOneAndDelete(id);

  await Stream.find();
  const response = new ResponseModel(
    true,
    "Songs fetched successfully.",
    requestList
  );
  res.status(200).json(response);
};

export const createStreamUser = (req, res) => {
  const { user_id, callId, tableNo } = req.body;
  const api_secret_key = process.env.STREAM_SECRET_KEY;
  const api_key = process.env.STREAM_API_KEY;

  try {
    const serverClient = StreamChat.getInstance(api_key, api_secret_key);
    const token = serverClient.createToken(user_id);
    let response = new ResponseModel(true, "Player added successfully", {
      token,
      user_id,
      callId,
      tableNo,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error("Error generating token:", error.message);
    res.status(500).json({ error: "Error generating token" });
  }
};

export const sendStreamRequestToMaster = async (req, res) => {
  const { url, userId, tableNo } = req?.body || {};

  let request;

  const existingRequest = await Stream.findOne({ userId });

  if (existingRequest) {
    request = await Stream.findOneAndUpdate(
      { userId },
      { url, tableNo, isActive: true, isAccepted: false },
      { runValidators: true, new: true }
    );
  } else {
    request = await Stream.create({ url, userId, tableNo });
  }

  let response = new ResponseModel(
    true,
    existingRequest
      ? "Request updated successfully"
      : "Request placed successfully",
    request
  );
  res.status(200).json(response);
};

export const changeStreamStatus = async (req, res) => {
  const { id, isActive, isAccepted } = req?.body || {};

  if (isAccepted) {
    await Stream.findOneAndUpdate({ _id: id }, { isAccepted });
    await Stream.updateMany({ _id: { $ne: id } }, { isAccepted: false });
  }
  await Stream.findOneAndUpdate({ _id: id }, { isActive }, { new: true });

  let response = new ResponseModel(true, "status changed successfully");
  res.status(200).json(response);
};

export const getLiveStream = async (req, res, next) => {
  const requestList = await Stream.find({ isAccepted: true, isActive: true });
  const response = new ResponseModel(
    true,
    "Songs fetched successfully.",
    requestList
  );
  res.status(200).json(response);
};
