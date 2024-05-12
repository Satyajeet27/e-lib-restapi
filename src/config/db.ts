import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
  try {
    // we have to register the listner first before making the connection with database
    mongoose.connection.on("connected", () => {
      console.log("Connected to database successfully");
    });
    mongoose.connection.on("error", (err: Error) => {
      console.log("Error in connecting to database.", err);
    });
    await mongoose.connect(config.databaseUrl as string);
  } catch (error) {
    console.error("Failed to connect to database. ", error);
    //using process exit as if database is not connected then there is no any need to run the server
    process.exit(1);
  }
};

export default connectDB;
