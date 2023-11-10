// assembly

const mongoose = require("mongoose");

const vidhanSabhaLabelSchema = new mongoose.Schema({
  marathi: {
    banner_label: {
      type: String,
      required: true,
    },
    banner_title: {
      type: String,
      required: true,
    },
    banner_description: {
      type: String,
      required: true,
    },
    topics: {
      topics_title: {
        type: String,
        required: true,
      },
      session: {
        content: {
          content_no: {
            type: Number,
            required: true,
          },
          content_name: {
            type: String,
            required: true,
          },
          content_document: {
            type: String,
            required: true,
          },
          content_createdAt: {
            type: String,
            required: true,
          },
        },
      },
    },
    legislative_council: {
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
  },
  english: {
    banner_label: {
      type: String,
      required: true,
    },
    banner_title: {
      type: String,
      required: true,
    },
    banner_description: {
      type: String,
      required: true,
    },
    topics: {
      topics_title: {
        type: String,
        required: true,
      },
      session: {
        content: {
          content_no: {
            type: Number,
            required: true,
          },
          content_name: {
            type: String,
            required: true,
          },
          content_document: {
            type: String,
            required: true,
          },
          content_createdAt: {
            type: String,
            required: true,
          },
        },
      },
    },
    legislative_council: {
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
  },
});

const VidhanSabhaLabel = mongoose.model(
  "VidhanSabhaLabel",
  vidhanSabhaLabelSchema
);

module.exports = VidhanSabhaLabel;
