const mongoose = require("mongoose");

// Mantrimandal / council of minister
const ministerSchema = new mongoose.Schema(
  {
    assembly_number: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assembly",
    },
    year: {
      type: String,
    },
    member_name: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
    designation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Designation",
    },
    ministry_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ministry",
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
      enum: ["Pending", "Approved", "Rejected", "Archived"],
      default: "Pending",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Minister", ministerSchema);
