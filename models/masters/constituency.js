// Constituency Name	मतदारसंघाचे नाव	Assembly Number

const mongoose = require("mongoose");

const constituencySchema = new mongoose.Schema(
  {
    marathi: {
      constituency_assembly: {
        type: String,
        required: true,
      },
      assembly_number: {
        type: Number,
        required: true,
      },
    },
    english: {
      constituency_assembly: {
        type: String,
        required: true,
      },
      assembly_number: {
        type: Number,
        required: true,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isUpdated: {
      type: Boolean,
      default: false,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Constituency = mongoose.model("Constituency", constituencySchema);

module.exports = Constituency;
