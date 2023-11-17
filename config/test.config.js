const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

const connectDB = async () => {
  let mongod;
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.createConnection(uri);
};

const quitDB = async () => {
  await mongoose.connection.dropDatabase();

  await mongoose.disconnect();
};

module.exports = { connectDB, quitDB };
