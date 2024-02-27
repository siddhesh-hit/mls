const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    address: { type: String, required: true },
    telephone: {
      type: Array,
      required: true,
    },
    fax: {
      type: Array,
      required: true,
    },
    email: {
      type: String,
      contactrequired: true,
    },
    map_url: {
      type: String,
      required: true,
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
  { timestamps: true }
);

module.exports = mongoose.model("ContactUs", contactSchema);
