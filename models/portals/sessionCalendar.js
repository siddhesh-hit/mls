const mongoose = require("mongoose");
const ImageSchema = require("./imageSchema");

const sessionCalendarSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    topic_name: {
      type: String,
      required: true,
    },
    houses: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    documents: [
      {
        title: {
          type: String,
          required: true,
        },
        date: {
          type: String,
          required: true,
        },
        document: ImageSchema,
      },
    ],
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

const SessionCalendar = mongoose.model(
  "SessionCalendar",
  sessionCalendarSchema
);

module.exports = SessionCalendar;
