const mongoose = require("mongoose");

const ImageSchema = require("./imageSchema");

const vidhanSabhaSchema = new mongoose.Schema(
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
    },
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
    structure: {
      name: String,
      profile: ImageSchema,
      type: String,
      term_limit: Number,
      seats: Number,
    },
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
  },
  { timestamps: true }
);

const VidhanSabha = mongoose.model("VidhanSabha", vidhanSabhaSchema);

module.exports = VidhanSabha;
