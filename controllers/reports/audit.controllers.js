const asyncHandler = require("express-async-handler");

const AuditTrail = require("../../models/reports/AuditTrail");

// @desc    Create a Audittrail
// @route   POST /api/audit/
// @access  Public
const createAudit = asyncHandler(async (req, res) => {
  try {
    let data = req.body;

    if (!data) {
      res.status(400);
      throw new Error("Fill data properly");
    }

    const audit = await AuditTrail.create(data);
    if (!audit) {
      res.status(400);
      throw new Error("Failed to create audit");
    }

    res
      .status(201)
      .json({ data: audit, message: "Audit created!", success: true });
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
    let { perPage, perLimit, ...id } = req.query;
    console.log(id);
    const pageOptions = {
      page: parseInt(perPage, 10) || 0,
      limit: parseInt(perLimit, 10) || 10,
    };
    let matchedQuery = {};

    if (id.message) {
      matchedQuery["message"] = new RegExp(`.*${id.message}.*`, "i");
    }

    if (id.userId === "user") {
      matchedQuery["userId"] = { $ne: null };
    }

    if (id.userId === "guest") {
      matchedQuery["userId"] = { $eq: null };
    }

    let audits = await AuditTrail.aggregate([
      {
        $match: matchedQuery,
      },
      {
        $facet: {
          audit: [
            { $sort: { createdAt: -1 } },
            { $skip: pageOptions.page * pageOptions.limit },
            { $limit: pageOptions.limit },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    let auditPopulate = await AuditTrail.populate(audits[0].audit, {
      path: "userId",
    });

    if (!audits) {
      res.status(400);
      throw new Error("No audit trails found.");
    }

    res.status(200).json({
      success: true,
      data: auditPopulate || [],
      count: audits[0].totalCount[0]?.count || 0,
      message: "Audit trail fetched successfully!",
    });
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
    let audit = await AuditTrail.findById(req.params.id);

    if (!audit) {
      res.status(400);
      throw new Error("No audit trail found");
    }

    res
      .status(200)
      .json({ data: audit, message: "Audit fetched!", success: true });
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
    let data = req.body;

    const checkAudit = await AuditTrail.findById(req.params.id);
    if (checkAudit) {
      res.status(400);
      throw new Error("No audit trail found.");
    }

    if (!data) {
      res.status(400);
      throw new Error("Fill data properly.");
    }

    const audit = await AuditTrail.findByIdAndUpdate(req.params.id, data, {
      runValidators: true,
      new: true,
    });

    if (!audit) {
      res.status(400);
      throw new Error("Failed to updated audit");
    }

    res
      .status(200)
      .json({ data: audit, message: "Audit upadted!", success: true });
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
    let audit = await AuditTrail.findByIdAndDelete(req.params.id);

    if (!audit) {
      res.status(400);
      throw new Error("No audit trail found");
    }

    res
      .status(204)
      .json({ data: {}, message: "Audit deleted!", success: true });
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
