const mongoose = require("mongoose");

const auditTrailSchema = new mongoose.Schema(
  {
    userIp: {
      type: String,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    endPoints: { type: String },
    method: { type: String },
    query: { type: Object },
    message: { type: String },
    userAgent: { type: String },
    clientSide: { type: String },
    statusCode: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditTrail", auditTrailSchema);
