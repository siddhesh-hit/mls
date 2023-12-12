// Gender;

const mongoose = require("mongoose");

const genderSchema = new mongoose.Schema(
  {
    marathi: {
      gender: {
        type: String,
        required: true,
      },
    },
    english: {
      gender: {
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

const Gender = mongoose.model("Gender", genderSchema);

module.exports = Gender;
