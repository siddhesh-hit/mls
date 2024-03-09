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
});

const MemberGraph = mongoose.model("MemberGraph", memberGraphSchema);

module.exports = MemberGraph;
