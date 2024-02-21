const asyncHandler = require("express-async-handler");

const AuditTrail = require("../../models/reports/AuditTrail");

// @desc    Create a Audittrail
// @route   POST /api/audit/
// @access  Public
const createAudit = asyncHandler(async (req, res) => {
  try {
  } catch (error) {
    res.status(500);
    throw new Error("Server error " + error);
  }
});

// @desc    Get all Audittrail
// @route   GET /api/audit/
// @access  Public
const getAllAudit = asyncHandler(async (req, res) => {
  try {
    console.log(req.ip);
    console.log(req.headers["x-forwarded-for"]);
    if (req.ip === "::1") {
      console.log("127.0.0.1");
    }
  } catch (error) {
    res.status(500);
    throw new Error("Server error " + error);
  }
});

// @desc    Get a Audittrail
// @route   GET /api/audit/:id
// @access  Public
const getSingleAudit = asyncHandler(async (req, res) => {
  try {
  } catch (error) {
    res.status(500);
    throw new Error("Server error " + error);
  }
});

// @desc    Update a Audittrail
// @route   PUT /api/audit/:id
// @access  SuperAdmin
const updateAudit = asyncHandler(async (req, res) => {
  try {
  } catch (error) {
    res.status(500);
    throw new Error("Server error " + error);
  }
});

// @desc    Delete a Audittrail
// @route   DELETE /api/audit/:id
// @access  SuperAdmin
const deleteAudit = asyncHandler(async (req, res) => {
  try {
  } catch (error) {
    res.status(500);
    throw new Error("Server error " + error);
  }
});

module.exports = {
  createAudit,
  getAllAudit,
  getSingleAudit,
  updateAudit,
  deleteAudit,
};
