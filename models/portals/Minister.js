const mongoose = require("mongoose");

const ministerSchema = new mongoose.Schema(
  {
    assembly_number: {
      type: String,
      requied: true,
    },
    ministry_type: {
      type: String,
      requied: true,
    },
    member_name: {
      type: String,
      requied: true,
    },
    designation: {
      type: String,
      requied: true,
    },
    ministry: {
      type: String,
      requied: true,
    },
    isUpdated: {
      type: Boolean,
      default: false,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Minister", ministerSchema);
