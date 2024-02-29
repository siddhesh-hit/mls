// external modules
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cron = require("node-cron");
const logger = require("morgan");
const fs = require("fs");
const path = require("path");
const os = require("os");
const cluster = require("cluster");

// internal modules
const connectDB = require("./config/db.config");
const { notFound, errorHandler, DuplicateError } = require("./middlewares/errorMiddleware");
const { logging } = require("./middlewares/logMiddleware");
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

// to allow and catch ip behind proxy
app.set("trust proxy", true);

// parse the data
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// logger

// create a write stream (in append mode)
let successLogStream = fs.createWriteStream(
  path.join(__dirname, "success.log"),
  {
    flags: "a",
  }
);

let errorLogStream = fs.createWriteStream(path.join(__dirname, "error.log"), {
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

// middleware to track user audit
app.use(logging);

// defining the routes
app.use("/api/v1", routes);

// static files
app.use("/images", express.static("./images"));
app.use("/exports", express.static("./exports"));

// error handler
app.use(notFound);
app.use(errorHandler);
app.use(DuplicateError);

// server configuration
const PORT = process.env.PORT || 8484;
const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
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

  // console.log(`Worker ${process.pid} started`);
}

// // cronjob for data dump
// cron.schedule("0 0 * * *", () => {
//   main().catch(console.error);
// });

const proNam = process;
// console.log(cluster);
// console.log(proNam);

// export the app
module.exports = app;
