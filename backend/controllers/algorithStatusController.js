import AlgorithmStatus from "../models/algorithStatus";
import ResponseModel from "./responseModel";

export const addUpdateAlgorithmStatus = async (req, res, next) => {
  const { isApplied, id } = req.body;

  if (!id) {
    const algoStatus = await AlgorithmStatus.create({
      isApplied: isApplied || false,
    });
    let response = new ResponseModel(
      true,
      "Algo Status added successfully",
      algoStatus
    );
    res.status(200).json(response);
  } else {
    let algoStatus = await AlgorithmStatus.findByIdAndUpdate(
      id,
      {
        isApplied: isApplied,
      },
      {
        new: true,
      }
    );

    let response = new ResponseModel(
      true,
      "Player updated successfully",
      algoStatus
    );
    res.status(200).json(response);
  }
};
