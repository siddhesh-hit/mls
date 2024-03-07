const mongooose = require("mongoose");

const pendingSchema = new mongooose.Schema(
  {
    data_object: { type: mongooose.Schema.Types.Mixed },
    modelId: { type: String, required: true },
    modelName: { type: String, required: true },
    approved_by: { type: mongooose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["Accepted", "Rejected"] },
    action: { type: String, enum: ["Create", "Update", "Delete"] },
    isPending: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongooose.model("Pending", pendingSchema);
