// District Name

const mongoose = require("mongoose");

const districtSchema = new mongoose.Schema(
  {
    marathi: {
      district: {
        type: String,
        required: true,
      },
    },
    english: {
      district: {
        type: String,
        required: true,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isUpdated: {
      type: Boolean,
      default: false,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const District = mongoose.model("District", districtSchema);

module.exports = District;
