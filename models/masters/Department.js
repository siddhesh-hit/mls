const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    sub_dep: {
      type: String,
      required: true,
    },
    designation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Designation",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", departmentSchema);

// Department name, year, sub departments name, year
// And designations
