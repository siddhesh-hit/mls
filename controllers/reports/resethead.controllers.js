const asyncHandler = require("express-async-handler");

const ResetHead = require("../../models/reports/ResetHead");

// @desc    Create a ResetHead
// @route   POST /api/v1/reset/
// @access  SuperAdmin
const createResetHead = asyncHandler(async (data, res) => {
  try {
    if (!data) {
      res.status(400);
      throw new Error("Fill each data properly");
    }

    const resetHead = await ResetHead.create(data);
    if (!resetHead) {
      res.status(400);
      throw new Error("Failed to create an entry in resetHead");
    }

    return {
      success: true,
      data: resetHead,
      message: "Archieve created successfully.",
    };
  } catch (error) {
    res.status(500);
    throw new Error("Server error: " + error);
  }
});

// @desc    Get all ResetHead
// @route   GET /api/v1/reset/
// @access  SuperAdmin
const getAllResetHead = asyncHandler(async (req, res) => {
  try {
    let { perPage, perLimit, ...id } = req.query;

    const pageOptions = {
      page: parseInt(perPage, 10) || 0,
      limit: parseInt(perLimit, 10) || 10,
    };

    let resetHead = await ResetHead.find(id)
      .limit(pageOptions.limit)
      .skip(pageOptions.page * pageOptions.limit)
      .exec();

    if (!resetHead) {
      res.status(400);
      throw new Error("No resethead entries found.");
    }

    res.status(200).json({
      success: true,
      data: resetHead,
      message: "Resethead fetched successfully",
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server error: " + error);
  }
});

// @desc    Get a ResetHead
// @route   GET /api/v1/reset/:id
// @access  SuperAdmin
const getSingleResetHead = asyncHandler(async (req, res) => {
  try {
    let resetHead = await ResetHead.findById(req.params.id);
    if (!resetHead) {
      res.status(400);
      throw new Error("No entries for provided entry found");
    }

    res.status(200).json({
      success: true,
      data: resetHead,
      message: "ResetHead entries fetched successfully.",
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server error: " + error);
  }
});

// @desc    Update a ResetHead
// @route   PUT /api/v1/reset/:id
// @access  SuperAdmin
const updateResetHead = asyncHandler(async (req, res) => {
  try {
    let data = req.body;

    if (!data) {
      res.status(400);
      throw new Error("Fill each data properly");
    }

    let checkResetHead = await ResetHead.findById(req.params.id);
    if (checkResetHead) {
      res.status(400);
      throw new Error("No resethead found for provided id.");
    }

    const resetHead = await ResetHead.create(data);
    if (!resetHead) {
      res.status(400);
      throw new Error("Failed to create an entry in resetHead");
    }

    res.status(200).json({
      success: true,
      data: resetHead,
      message: "ResetHead updated successfully.",
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server error: " + error);
  }
});

// @desc    Delete a ResetHead
// @route   DELETE /api/v1/reset/:id
// @access  SuperAdmin
const deleteResetHead = asyncHandler(async (req, res) => {
  try {
    let resetHead = await ResetHead.findByIdAndDelete(req.params.id);
    if (!resetHead) {
      res.status(400);
      throw new Error("No entries for provided entry found");
    }

    res.status(200).json({
      success: true,
      data: resetHead,
      message: "ResetHead entries deleted successfully.",
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server error: " + error);
  }
});

module.exports = {
  createResetHead,
  getAllResetHead,
  getSingleResetHead,
  updateResetHead,
  deleteResetHead,
};
