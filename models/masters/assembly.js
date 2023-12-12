// Assembly Number	Assembly Name	Start Date	End Date	Current Assembly

const mongoose = require("mongoose");

const assemblySchema = new mongoose.Schema(
  {
    marathi: {
      assembly_number: {
        type: String,
        required: true,
      },
      assembly_name: {
        type: String,
        required: true,
      },
    },
    english: {
      assembly_number: {
        type: String,
        required: true,
      },
      assembly_name: {
        type: String,
        required: true,
      },
    },
    start_date: {
      type: String,
      required: true,
    },
    end_date: {
      type: String,
      required: true,
    },
    current_assembly: {
      type: String,
      required: true,
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

const Assembly = mongoose.model("Assembly", assemblySchema);

module.exports = Assembly;
