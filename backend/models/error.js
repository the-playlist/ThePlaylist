import mongoose from "mongoose";

// Define the schema
const errorSchema = new mongoose.Schema(
    {
        message: {
            type: String,
            default: "",
        },
        name: {
            type: String,
            default: "",
        },
        stack: {
            type: String,
            default: "",
        },
        digest: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

// Use a dynamic model name or conditionally check if the model is already defined
const ErrorModel = mongoose.models.Error || mongoose.model("Error", errorSchema);

export default ErrorModel;
