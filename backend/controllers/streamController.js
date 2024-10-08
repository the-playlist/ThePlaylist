import Limit from "../models/limits";
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
  const requestList = await Stream.find({ isActive: true }).sort({
    isAccepted: -1,
  });
  const acceptedRequests = requestList.filter(
    (request) => request.isAccepted == true
  );
  const activeRequests = requestList.filter(
    (request) => request.isActive && !request.isAccepted
  );
  let content = {
    isAcceptedRequests: acceptedRequests,
    isActiveRequests: activeRequests,
  };

  const response = new ResponseModel(
    true,
    "Songs fetched successfully.",
    content
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
  const { user_id, callId, tableno } = req.body;
  const api_secret_key = process.env.STREAM_SECRET_KEY;
  const api_key = process.env.STREAM_API_KEY;

  try {
    const serverClient = StreamChat.getInstance(api_key, api_secret_key);
    const token = serverClient.createToken(user_id);
    let response = new ResponseModel(true, "Stream Session Created", {
      token,
      user_id,
      callId,
      tableno,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error("Error generating token:", error.message);
    res.status(500).json({ error: "Error generating token" });
  }
};

export const sendStreamRequestToMaster = async (req, res) => {
  const { url, userId, tableno, callId, token } = req?.body || {};
  const heading = "Live Stream Limit";
  const currentActiveStreams = await Stream.find({
    isActive: true,
    isAccepted: false,
  }).lean();

  const limit = await Limit.findOne({ heading });
  if (limit && currentActiveStreams?.length >= limit.value) {
    let response = new ResponseModel(false, limit?.message);
    res.status(200).json(response);
    return;
  }
  let request;

  const existingRequest = await Stream.findOne({ userId });

  if (existingRequest) {
    request = await Stream.findOneAndUpdate(
      { userId },
      { url, tableno, callId, token, isActive: true, isAccepted: false },
      { runValidators: true, new: true }
    );
  } else {
    request = await Stream.create({ url, userId, tableno, callId, token });
  }
  const activeStream = await Stream.find({
    isActive: true,
    isAccepted: false,
  }).lean();
  let response = new ResponseModel(
    true,
    existingRequest
      ? "Request updated successfully"
      : "Request sent successfully",
    { request: request, activeStream: activeStream?.length }
  );
  res.status(200).json(response);
};

export const changeStreamStatus = async (req, res) => {
  const { id, isActive, isAccepted } = req?.body || {};
  let activeStream;
  if (isAccepted) {
    await Stream.deleteOne({ isAccepted: true });
    await Stream.findOneAndUpdate({ _id: id }, { isAccepted });
  }
  if (!isActive) {
    await Stream.deleteOne({ _id: id });
  } else {
    await Stream.findOneAndUpdate({ _id: id }, { isActive }, { new: true });
    activeStream = await Stream.find({
      isActive: true,
      isAccepted: false,
    }).lean();
  }

  let response = new ResponseModel(
    true,
    `${isActive == false && "Stream stopped"}`,
    {
      activeStream: activeStream?.length || 0,
    }
  );
  res.status(200).json(response);
};

export const getLiveStream = async (req, res, next) => {
  const requestList = await Stream.find({ isAccepted: true, isActive: true });
  const response = new ResponseModel(
    true,
    "Streams fetched successfully.",
    requestList
  );
  res.status(200).json(response);
};
