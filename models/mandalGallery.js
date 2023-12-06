const mongoose = require("mongoose");

const mandalGallerySchema = new mongoose.Schema(
  {
    fieldname: String,
    originalname: String,
    encoding: String,
    mimetype: String,
    destination: String,
    filename: String,
    path: String,
    size: Number,
  },
  { timestamps: true }
);

const MandalGallery = mongoose.model("MandalGallery", mandalGallerySchema);

module.exports = MandalGallery;
