const mongoose = require("mongoose");

const ministrySchema = new mongoose.Schema(
  {
    ministry_name: {
      type: String,
      required: true,
    },
    minister: {
      type: String,
      required: true,
    },
    year: {
      type: Date,
      required: true,
    },
    sub_ministry: [
      {
        name: String,
        minister: String,
      },
    ],
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

module.exports = mongoose.model("Ministry", ministrySchema);
