const mongoose = require("mongoose");

const documentMethodSubTypeSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    methodtype_id: String,
    alias: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Document_Method_Sub_Type",
  documentMethodSubTypeSchema
);
