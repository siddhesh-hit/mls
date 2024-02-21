const mongoose = require("mongoose");

const auditTrailSchema = new mongoose.Schema({}, { timestamps: true });

module.exports = mongoose.model("AuditTrail", auditTrailSchema);
