const mongoose = require("mongoose");

const legislativeMemberLabelSchema = new mongoose.Schema({
  marathi: {
    profile: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    constituency: {
      type: String,
      required: true,
    },
    party_name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
  },
  english: {
    profile: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    constituency: {
      type: String,
      required: true,
    },
    party_name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
  },
});

const LegislativeMemberLabel = mongoose.model(
  "LegislativeMemberLabel",
  legislativeMemberLabelSchema
);

module.exports = LegislativeMemberLabel;
