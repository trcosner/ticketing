import mongoose from "mongoose";
import { app } from "./app";
import { RedisConnection, redisClient } from "@trc-ticketing/common"; // Add this import

const start = async () => {
  console.log("Starting up...");
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await RedisConnection.getInstance();
    console.log("Connected to Redis successfully!");

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to mongodb");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Auth Service listening on port 3000");
  });
};

start();
