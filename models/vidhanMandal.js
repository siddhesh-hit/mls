const mongoose = require("mongoose");

const ImageSchema = require("./imageSchema");

const vidhanMandal = new mongoose.Schema({
  marathi: {
    about_us: [
      {
        image: ImageSchema,
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        documents: ImageSchema,
      },
    ],
  },
  english: {
    about_us: [
      {
        image: ImageSchema,
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        documents: ImageSchema,
      },
    ],
  },
});

const VidhanMandal = mongoose.model("VidhanMandal", vidhanMandal);

module.exports = VidhanMandal;
