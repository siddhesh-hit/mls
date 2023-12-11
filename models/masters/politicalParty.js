// Party Full Name	Short Name	Party Flag	Party Symbol

const mongoose = require("mongoose");

const imageSchema = require("../imageSchema");

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
    party_flag: imageSchema,
    party_symbol: imageSchema,
  },
  {
    timestamps: true,
  }
);

const PoliticalParty = mongoose.model("PoliticalParty", politicalPartySchema);

module.exports = PoliticalParty;
