// import mongoose from "mongoose";

// const connectMongoDb = async () => {
//   try {
//     if (process.env.MONGO_URL) {
//       await mongoose.connect(process.env.MONGO_URL);
//       console.log("connected to mongo db");
//     } else {
//       console.error("MONGO_URL environment variable is not defined.");
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

// export default connectMongoDb;

import mongoose from "mongoose";

let cached = global.mongoose || { conn: null, promise: null };

const connectMongoDb = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL environment variable is not defined.");
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URL, {
        bufferCommands: false,
        maxPoolSize: 10, // connection pool size
      })
      .then((mongoose) => {
        console.log("✅ Connected to MongoDB");
        return mongoose;
      });
  }

  cached.conn = await cached.promise;
  global.mongoose = cached;
  return cached.conn;
};

export default connectMongoDb;
