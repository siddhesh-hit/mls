const mongoose = require("mongoose");

const ministerSchema = new mongoose.Schema(
  {
    assembly_number: {
      type: String,
      required: true,
    },
    ministry_type: {
      type: String,
      required: true,
    },
    member_name: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    ministry: {
      type: String,
      required: true,
    },
    isDissolved: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Minister", ministerSchema);
