const mongoose = require("mongoose");

const ImageSchema = require("./imageSchema");

const vidhanParishadSchema = new mongoose.Schema(
  {
    marathi: {
      description: {
        type: String,
        required: true,
      },
      legislative_council: [
        {
          council_name: {
            type: String,
            required: true,
          },
          council_description: {
            type: String,
            required: true,
          },
        },
      ],
      structure: {
        name: {
          type: String,
        },
        type: {
          type: String,
        },
        term_limit: {
          type: String,
        },
        seats: {
          type: String,
        },
      },
    },
    english: {
      description: {
        type: String,
        required: true,
      },
      legislative_council: [
        {
          council_name: {
            type: String,
            required: true,
          },
          council_description: {
            type: String,
            required: true,
          },
        },
      ],
      structure: {
        name: {
          type: String,
        },
        type: {
          type: String,
        },
        term_limit: {
          type: String,
        },
        seats: {
          type: String,
        },
      },
    },
    structure_profile: ImageSchema,
    banner_image: ImageSchema,
    legislative_council: [
      {
        council_profile: ImageSchema,
      },
    ],
    publication: [
      {
        english: {
          name: {
            type: String,
          },
          document: ImageSchema,
        },
        marathi: {
          name: {
            type: String,
          },
          document: ImageSchema,
        },
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
  { timestamps: true }
);

module.exports = mongoose.model("VidhanParishad", vidhanParishadSchema);
