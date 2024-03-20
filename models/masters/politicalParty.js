// Party Full Name	Short Name	Party Flag	Party Symbol

const mongoose = require("mongoose");

const imageSchema = require("../portals/imageSchema");

const politicalPartySchema = new mongoose.Schema(
  {
    marathi: {
      party_name: {
        type: String,
        required: true,
      },
      short_name: {
        type: String,
        required: true,
      },
    },
    english: {
      party_name: {
        type: String,
        required: true,
      },
      short_name: {
        type: String,
        required: true,
      },
    },
    isHouse: {
      type: String,
      enum: ["Assembly", "Constituency"],
      required: true,
    },
    party_flag: imageSchema,
    party_symbol: imageSchema,
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

const PoliticalParty = mongoose.model("PoliticalParty", politicalPartySchema);

module.exports = PoliticalParty;
