const mongoose = require("mongoose");

const ImageSchema = require("./imageSchema");

const vidhanMandal = new mongoose.Schema(
  {
    marathi: {
      about_us: [
        {
          title: {
            type: String,
            required: true,
          },
          description: {
            type: String,
            required: true,
          },
        },
      ],
    },
    english: {
      about_us: [
        {
          title: {
            type: String,
            required: true,
          },
          description: {
            type: String,
            required: true,
          },
        },
      ],
    },
    mandal_image: [
      {
        image: ImageSchema,
        documents: ImageSchema,
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
  {
    timestamps: true,
  }
);

const VidhanMandal = mongoose.model("VidhanMandal", vidhanMandal);

module.exports = VidhanMandal;
