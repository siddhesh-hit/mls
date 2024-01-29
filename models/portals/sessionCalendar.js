const mongoose = require("mongoose");
const ImageSchema = require("./imageSchema");

const sessionCalendarSchema = new mongoose.Schema(
  {
    marathi: {
      session: {
        type: String,
        required: true,
      },
    },
    english: {
      session: {
        type: String,
        required: true,
      },
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
