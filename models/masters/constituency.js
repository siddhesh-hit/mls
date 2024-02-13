// Constituency Name	मतदारसंघाचे नाव	Assembly Number

const mongoose = require("mongoose");

const constituencySchema = new mongoose.Schema(
  {
    marathi: {
      assembly: {
        constituency_assembly: {
          type: String,
        },
        assembly_number: {
          type: String,
        },
        year: {
          type: String,
        },
      },
      council: {
        constituency_type: {
          type: String,
        },
        constituency_name: {
          type: String,
        },
        year: {
          type: String,
        },
      },
    },
    english: {
      assembly: {
        constituency_assembly: {
          type: String,
        },
        assembly_number: {
          type: String,
        },
        year: {
          type: String,
        },
      },
      council: {
        constituency_type: {
          type: String,
        },
        constituency_name: {
          type: String,
        },
        year: {
          type: String,
        },
      },
    },
    isHouse: {
      type: String,
      enum: ["Assembly", "Constituency"],
      requried: true,
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
