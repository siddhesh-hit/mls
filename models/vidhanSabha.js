const mongoose = require("mongoose");

const vidhanSabhaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    banner_image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    topics: [
      {
        topics_title: {
          type: String,
          required: true,
        },
        session: [
          {
            content: [
              {
                content_name: {
                  type: String,
                  required: true,
                },
                content_document: {
                  type: String,
                  required: true,
                },
                content_createdAt: {
                  type: Date,
                },
              },
            ],
          },
        ],
      },
    ],
    legislative_council: [
      {
        council_profile: {
          type: String,
          required: true,
        },
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
  { timestamps: true }
);

const VidhanSabha = mongoose.model("VidhanSabha", vidhanSabhaSchema);

module.exports = VidhanSabha;
