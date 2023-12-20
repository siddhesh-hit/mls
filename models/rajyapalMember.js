const mongoose = require("mongoose");

const imageSchema = require("./imageSchema");

const legislativeMember = new mongoose.Schema(
  {
    marathi: {
      name: {
        type: String,
        required: true,
      },
      elected_date: {
        type: String,
        required: true,
      },
      gender: {
        type: String,
        required: true,
      },
      place_of_birth: {
        type: String,
        required: true,
      },
      political_career: {
        type: String,
        required: true,
      },
    },
    english: {
      name: {
        type: String,
        required: true,
      },
      elected_date: {
        type: String,
        required: true,
      },
      gender: {
        type: String,
        required: true,
      },
      place_of_birth: {
        type: String,
        required: true,
      },
      political_career: {
        type: String,
        required: true,
      },
    },
    image: imageSchema,
    url: {
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
            content: imageSchema,
          },
        ],
      },
    ],
    isUpdated: {
      type: Boolean,
      default: false,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
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
