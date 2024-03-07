const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();
const PORT = process.env.PORT || 8484;
dotenv.config();

// connection of database & server
const connectDB = async () => {
  try {
    // console.log(process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI);
    return conn;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
