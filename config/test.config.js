const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongod;

const connectDB = async () => {
  try {
    if (!mongod) {
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log("Connected to the in-memory database");
    }
  } catch (error) {
    console.error("Error connecting to the in-memory database:", error.message);
    process.exit(1);
  }
};

const closeDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
      console.log("Closed the in-memory database connection");
    }
  } catch (error) {
    console.error(
      "Error closing the in-memory database connection:",
      error.message
    );
    process.exit(1);
  }
};

module.exports = { connectDB, closeDB };
