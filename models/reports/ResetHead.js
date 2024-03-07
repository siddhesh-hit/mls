const mongoose = require("mongoose");

const resetHeadSchema = new mongoose.Schema(
  {
    data_object: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    operation_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    performed_on: {
      type: Date,
      default: Date.now(),
    },
    isReverted: { type: Boolean, default: false },
    revertedCount: { type: Number, default: 0 },
    modelName: { type: String, required: true },
    action: { type: String, enum: ["Update", "Create", "Delete"] },
    modelId: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ResetHead", resetHeadSchema);
