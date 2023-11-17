const mongoose = require("mongoose");

const memberGraphSchema = new mongoose.Schema({
  marathi: {
    partyRuling: [
      {
        partyName: {
          type: String,
          required: true,
        },
        partyMember: {
          type: Number,
          required: true,
        },
      },
    ],
    partyOpposition: [
      {
        partyName: {
          type: String,
          required: true,
        },
        partyMember: {
          type: Number,
          required: true,
        },
      },
    ],
    partyOther: [
      {
        partyName: {
          type: String,
          required: true,
        },
        partyMember: {
          type: Number,
          required: true,
        },
      },
    ],
    partyVacant: [
      {
        partyName: {
          type: String,
          required: true,
        },
        partyMember: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  english: {
    partyRuling: [
      {
        partyName: {
          type: String,
          required: true,
        },
        partyMember: {
          type: Number,
          required: true,
        },
      },
    ],
    partyOpposition: [
      {
        partyName: {
          type: String,
          required: true,
        },
        partyMember: {
          type: Number,
          required: true,
        },
      },
    ],
    partyOther: [
      {
        partyName: {
          type: String,
          required: true,
        },
        partyMember: {
          type: Number,
          required: true,
        },
      },
    ],
    partyVacant: [
      {
        partyName: {
          type: String,
          required: true,
        },
        partyMember: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

const MemberGraph = mongoose.model("MemberGraph", memberGraphSchema);

module.exports = MemberGraph;
