const mongoose = require("mongoose");

const documentMethodTypeSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    method_id: String,
    alias: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Document_Method_Type",
  documentMethodTypeSchema
);
