const mongoose = require("mongoose");

const navigationSchema = new mongoose.Schema(
  {
    marathi: {
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
    },
    english: {
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
    },
    isDropDown: {
      type: Boolean,
      default: false,
    },
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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Navigation", navigationSchema);
