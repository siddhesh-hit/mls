const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema(
  {
    count: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Visit = mongoose.model("Visit", visitSchema);

module.exports = Visit;
