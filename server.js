// external modules
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// internal modules
const connectDB = require("./config/db.config");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const userRoutes = require("./routes/user.routes");
const sabhaRoutes = require("./routes/sabha.routes");
const parishadRoutes = require("./routes/parishad.routes");
const mandalRoutes = require("./routes/mandal.routes");
const galleryRoutes = require("./routes/gallery.routes");
const graphRoutes = require("./routes/graph.routes");

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

// test get
app.get("/back", (req, res) => {
  res.json({
    message: "API is running....",
  });
});

// defining the routes
app.use("/api/user", userRoutes);
app.use("/api/sabha", sabhaRoutes);
app.use("/api/parishad", parishadRoutes);
app.use("/api/mandal", mandalRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/graph", graphRoutes);

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

// export the app
module.exports = app;
