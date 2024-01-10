const mongoose = require("mongoose");

const imageSchema = require("./imageSchema");

const librarySchema = new mongoose.Schema({
  marathi: {
    description: {
      type: String,
      required: true,
    },
  },
  english: {
    description: {
      type: String,
      required: true,
    },
  },
  banner: imageSchema,
  documents: [{ content: imageSchema }],
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
});

const Library = mongoose.model("Library", librarySchema);

module.exports = Library;
