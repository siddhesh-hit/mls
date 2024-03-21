const mongoose = require("mongoose");

const documentMinistrySchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    year: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Document_Ministry", documentMinistrySchema);
