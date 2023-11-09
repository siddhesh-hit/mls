const mongoose = require("mongoose");

const legislativeMember = new mongoose.Schema({
  profile,
});

const LegislativeMember = mongoose.model(
  "LegislativeMember",
  legislativeMember
);

module.exports = LegislativeMember;
