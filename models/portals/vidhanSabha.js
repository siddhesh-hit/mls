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
