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
    isActive: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const VidhanMandal = mongoose.model("VidhanMandal", vidhanMandal);

module.exports = VidhanMandal;
