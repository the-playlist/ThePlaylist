import Action from "../models/actions";
import ResponseModel from "./responseModel";

export const saveUserActions = async(req, res) => {
    const actionData = req.body;

    const action = await Action.findOneAndUpdate(
        actionData, // search for an identical document
        { $set: actionData }, // if found, update it with the same data
        { upsert: true, new: true } // upsert: create if not found, new: return the updated/created document
    );
    // const action = Action.create(req.body);
    let response = new ResponseModel(true, "Action logged successfully", action);
    res.status(200).json(response);
};