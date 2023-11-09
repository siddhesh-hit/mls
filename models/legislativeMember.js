const mongoose = require("mongoose");

const legislativeMember = new mongoose.Schema({
  profile: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  data_of_birth: {
    type: Date,
    required: true,
  },
  party_name: {
    type: String,
    required: true,
  },
  education: {
    type: String,
    required: true,
  },
  hobby: {
    type: String,
    required: true,
  },
  constiuency: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  useful_links: {
    type: String,
    required: true,
  },
  other_info: {
    type: String,
    required: true,
  },
  legislative_journey: {
    type: String,
    required: true,
  },
  marital_status: {
    type: String,
    required: true,
  },
});

const LegislativeMember = mongoose.model(
  "LegislativeMember",
  legislativeMember
);

module.exports = LegislativeMember;
