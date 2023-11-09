const mongoose = require("mongoose");

const legislativeMember = new mongoose.Schema({});

const LegislativeMember = mongoose.model(
  "LegislativeMember",
  legislativeMember
);

module.exports = LegislativeMember;
