const mongoose = require("mongoose");

const newDumpDebate = new mongoose.Schema(
  {
    id: {
      type: String,
    },
    session: {
      type: String,
    },
    house: {
      type: String,
    },
    year: {
      type: Date,
    },
    volume: {
      type: String,
    },
    kramank: {
      type: String,
    },
    date: {
      type: String,
    },
    speaker: {
      type: String,
    },
    method: {
      type: String,
    },
    method_type: {
      type: String,
    },
    method_sub_type: {
      type: String,
    },
    question_no: {
      type: String,
    },
    ministry: {
      type: String,
    },
    topic: {
      type: String,
    },
    places: {
      type: String,
    },
    keywords: {
      type: String,
    },
    members_name: {
      type: String,
    },
    page_no: {
      type: String,
    },
    fileurl: {
      type: String,
    },
    full_text: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    document_id: {
      type: String,
    },
    session_number: { type: String },
    sub_department: { type: String },
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

const postgresDebate = mongoose.model("DumpDebate", newDumpDebate);

module.exports = postgresDebate;
