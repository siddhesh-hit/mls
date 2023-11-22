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
  },
  { timestamps: true }
);

module.exports = mongoose.model("VidhanParishad", vidhanParishadSchema);
