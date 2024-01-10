const mongoose = require("mongoose");

const navigationSchema = new mongoose.Schema(
  {
    navigation: {
      type: String,
      required: true,
    },
    dropDownValue: [
      {
        name: {
          type: String,
        },
      },
    ],
    isDropDown: {
      type: Boolean,
      default: false,
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

module.exports = mongoose.model("Navigation", navigationSchema);
