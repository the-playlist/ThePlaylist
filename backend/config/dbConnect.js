import mongoose from "mongoose";

const connectMongoDb = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("connected to mongo db");
    } else {
      console.error("MONGODB_URI environment variable is not defined.");
    }
  } catch (error) {
    console.log(error);
  }
};

export default connectMongoDb;
