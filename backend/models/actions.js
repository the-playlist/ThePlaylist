import mongoose from "mongoose";

// One week in milliseconds (7 days)
const oneWeek = 7 * 24 * 60 * 60 * 1000;

const actionSchema = new mongoose.Schema({
    actionName: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    pathName: { type: String },
    details: { type: Object },
    createdAt: { type: Date, default: Date.now }, // when the document is created
    expiresAt: { type: Date, default: () => new Date(Date.now() + oneWeek) },
});
actionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Action = mongoose.models.Action || mongoose.model("Action", actionSchema);

export default Action;