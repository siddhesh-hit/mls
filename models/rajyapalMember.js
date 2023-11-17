const mongoose = require("mongoose");

const legislativeMember = new mongoose.Schema(
  {
    profile: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    register_date: {
      type: String,
      required: true,
    },
    date_of_birth: {
      type: Date,
      required: true,
    },
    birth_place: {
      type: String,
      required: true,
    },
    political_journey: {
      type: String,
      required: true,
    },
    speeches: [
      {
        year: {
          type: String,
          required: true,
        },
        values: [
          {
            language: {
              type: String,
              required: true,
              enum: ["marathi", "english", "hindi"], // Optional: Enum for specific languages
            },
            content: {
              type: String,
              required: true,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const LegislativeMember = mongoose.model(
  "LegislativeMember",
  legislativeMember
);

module.exports = LegislativeMember;
