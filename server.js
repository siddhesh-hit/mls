// external modules
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cron = require("node-cron");
const logger = require("morgan");
const os = require("os");
const cluster = require("cluster");
const fs = require("fs");
const path = require("path");

// internal modules
const connectDB = require("./config/db.config");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const routes = require("./routes");
// const main = require("./services/dumpDatabase");

// defining modules
const app = express();
dotenv.config();

// defining cors format
const corsConfig = {
  origin: true,
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

// parse the data
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// logger

// create a write stream (in append mode)
var successLogStream = fs.createWriteStream(
  path.join(__dirname, "success.log"),
  {
    flags: "a",
  }
);

var errorLogStream = fs.createWriteStream(path.join(__dirname, "error.log"), {
  flags: "a",
});

// Skip requests that aren't for the homepage
const skipSuccess = (req, res) => res.statusCode < 400;
const skipError = (req, res) => res.statusCode >= 400;

// Error logging
app.use(
  logger("combined", {
    skip: skipSuccess,
    stream: errorLogStream,
  })
);

// Success logging
app.use(
  logger("combined", {
    skip: skipError,
    stream: successLogStream,
  })
);

// test get
app.get("/back", (req, res) => {
  res.json({
    message: "API is running....",
  });
});

// defining the routes
app.use("/v1/api", routes);

// static files
app.use("/images", express.static("./images"));

// error handler
app.use(notFound);
app.use(errorHandler);

// server configuration
const PORT = process.env.PORT || 8484;
connectDB()
  .then(() => {
    console.log(`MongoDB is connected at MLS.`);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// // cronjob for data dump
// cron.schedule("0 0 * * *", () => {
//   main().catch(console.error);
// });

const proNam = process;
// console.log(cluster);
// console.log(proNam);

// export the app
module.exports = app;

var name = "sidd";

// function sayHello() {
//   console.log(name);
//   var name = "oksy ssidd";
//   console.log("update", name);
// }

// sayHello();
