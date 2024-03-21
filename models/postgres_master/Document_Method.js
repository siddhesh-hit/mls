const mongoose = require("mongoose");

const documentMethodSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    house: String,
    alias: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Document_Method", documentMethodSchema);
