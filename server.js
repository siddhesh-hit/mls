// external modules
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// internal modules
const connectDB = require("./config/db.config");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const userRoutes = require("./routes/user.routes");
const sabhaRoutes = require("./routes/sabha.routes");

// defining modules
const app = express();
dotenv.config();

// parse the data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// defining cors format
const corsConfig = {
  origin: true,
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));

// test get
app.get("/back", (req, res) => {
  res.json({
    message: "API is running....",
  });
});

// defining the routes
app.use("/api/user", userRoutes);
app.use("/api/sabha", sabhaRoutes);

// static files
app.use(express.static("public"));

// error handler
app.use(notFound);
app.use(errorHandler);

// server configuration
const PORT = process.env.PORT || 8484;
connectDB().then(() => {
  console.log(`MongoDB is connected at MLS.`);
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

// export the app
module.exports = app;
