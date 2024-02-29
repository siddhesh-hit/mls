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
      default: false,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Archived"],
      default: "Pending",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Gender = mongoose.model("Gender", genderSchema);

module.exports = Gender;
