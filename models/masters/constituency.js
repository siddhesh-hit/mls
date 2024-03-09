// Constituency Name	मतदारसंघाचे नाव	Assembly Number

const mongoose = require("mongoose");

const constituencySchema = new mongoose.Schema(
  {
    council: {
      constituency_name: {
        type: String,
      },
      constituency_number: {
        type: String,
      },
      constituency_type: {
        type: String,
      },
      year: {
        type: String,
      },
    },
    assembly: {
      constituency_name: {
        type: String,
      },
      assembly_number: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assembly",
      },
      year: {
        type: String,
      },
      constituency_type: {
        type: String,
      },
    },
    isHouse: {
      type: String,
      enum: ["Assembly", "Constituency"],
      requried: true,
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

const Constituency = mongoose.model("Constituency", constituencySchema);

module.exports = Constituency;
