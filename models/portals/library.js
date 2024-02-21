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
});

const Library = mongoose.model("Library", librarySchema);

module.exports = Library;
