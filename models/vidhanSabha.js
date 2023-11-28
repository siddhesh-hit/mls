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
    isUpdated: {
      type: Boolean,
      default: false,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const VidhanSabha = mongoose.model("VidhanSabha", vidhanSabhaSchema);

module.exports = VidhanSabha;
