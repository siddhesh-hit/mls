const mongoose = require("mongoose");

// Mantrimandal / council of minister
const ministerSchema = new mongoose.Schema(
  {
    assembly_number: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assembly",
    },
    member_name: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
    ministry_type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ministry",
      },
    ],
    designation: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Designation",
      },
    ],
    des_from: {
      type: Date,
    },
    des_to: {
      type: Date,
    },
    presiding: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PresidingOfficer",
      },
    ],
    pres_from: {
      type: Date,
    },
    pres_to: {
      type: Date,
    },
    legislative_position: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "LegislationPosition",
      },
    ],
    lp_from: {
      type: Date,
    },
    lp_to: {
      type: Date,
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
