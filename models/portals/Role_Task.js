const mongoose = require("mongoose");

const roleTaskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    taskName: [{ type: String }],
    activity: { type: String },
    role: {
      type: String,
      required: true,
      enum: ["Admin", "SuperAdmin", "Reviewer", "ContentCreator", "User"],
      default: "User",
    },
    permission: { type: Array, default: ["read"] },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
// "create", "read", "update", "delete", "user", "block", "upload";
module.exports = mongoose.model("Role_Task", roleTaskSchema);
