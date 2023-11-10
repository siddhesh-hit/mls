const mongoose = require("mongoose");

const vidhanMandal = new mongoose.Schema({
  marathi: {
    mandal_images: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    detail: {
      type: String,
      required: true,
    },
    structure: {
      type: String,
      required: true,
    },
  },
  english: {
    mandal_images: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    detail: {
      type: String,
      required: true,
    },
    structure: {
      type: String,
      required: true,
    },
  },
});

const VidhanMandal = mongoose.model("VidhanMandal", vidhanMandal);

module.exports = VidhanMandal;
