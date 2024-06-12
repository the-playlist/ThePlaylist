import mongoose from "mongoose";

const connectMongoDb = async () => {
  try {
    if (process.env.MONGO_URL) {
      await mongoose.connect(process.env.MONGO_URL);
      console.log("connected to mongo db");
    } else {
      console.error("MONGO_URL environment variable is not defined.");
    }
  } catch (error) {
    console.log(error);
  }
};

export default connectMongoDb;
