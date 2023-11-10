const mongoose = require("mongoose");

const vidhanMandalLabelSchema = new mongoose.Schema({
  marathi: {
    mandal_images_label: {
      type: String,
      required: true,
    },
    title_label: {
      type: String,
      required: true,
    },
    detail_label: {
      type: String,
      required: true,
    },
    structure_label: {
      type: String,
      required: true,
    },
  },
  english: {
    mandal_images_label: {
      type: String,
      required: true,
    },
    title_label: {
      type: String,
      required: true,
    },
    detail_label: {
      type: String,
      required: true,
    },
    structure_label: {
      type: String,
      required: true,
    },
  },
});

const VidhanMandalLabel = mongoose.model(
  "VidhanMandalLabel",
  vidhanMandalLabelSchema
);

module.exports = VidhanMandalLabel;
