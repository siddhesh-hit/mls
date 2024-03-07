const mongoose = require("mongoose");

const imageSchema = require("./imageSchema");

const rajyapalMemberSchema = new mongoose.Schema(
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
    date_of_birth: {
      type: String,
      required: true,
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
    isCurrent: {
      type: Boolean,
      default: false,
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
  },
  {
    timestamps: true,
  }
);

const RajyapalMember = mongoose.model("RajyapalMember", rajyapalMemberSchema);

module.exports = RajyapalMember;
