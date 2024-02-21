const asyncHandler = require("express-async-handler");

const Archive = require("../../models/reports/Archive");

// @desc    Create a Archive
// @route   POST /api/v1/archive/
// @access  SuperAdmin
const createArchive = asyncHandler(async (data, res) => {
  try {
    // let data = req.body;

    if (!data) {
      res.status(400);
      throw new Error("Fill each data properly");
    }

    const archive = await Archive.create(data);
    if (!archive) {
      res.status(400);
      throw new Error("Failed to create an entry in archive");
    }

    return {
      success: true,
      data: archive,
      message: "Archieve created successfully.",
    };
  } catch (error) {
    res.status(500);
    throw new Error("Server error: " + error);
  }
});

// @desc    Get all Archive
// @route   GET /api/v1/archive/
// @access  SuperAdmin
const getAllArchive = asyncHandler(async (req, res) => {
  try {
    let { perPage, perLimit, ...id } = req.query;

    const pageOptions = {
      page: parseInt(perPage, 10) || 0,
      limit: parseInt(perLimit, 10) || 10,
    };

    let archive = await Archive.find(id)
      .limit(pageOptions.limit)
      .skip(pageOptions.page * pageOptions.limit)
      .exec();

    if (!archive) {
      res.status(400);
      throw new Error("No archive entries found.");
    }

    res.status(200).json({
      success: true,
      data: archive,
      message: "Archive entries fetched successfully.",
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server error: " + error);
  }
});

// @desc    Get a Archive
// @route   GET /api/v1/archive/:id
// @access  SuperAdmin
const getSingleArchive = asyncHandler(async (req, res) => {
  try {
    let archive = await Archive.findById(req.params.id);

    if (!archive) {
      res.status(400);
      throw new Error("No archive entry found for provided id.");
    }

    res.status(200).json({
      success: true,
      data: archive,
      message: "Archive entry fetched successfully.",
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server error: " + error);
  }
});

// @desc    Update a Archive
// @route   PUT /api/v1/archive/:id
// @access  SuperAdmin
const updateArchive = asyncHandler(async (req, res) => {
  try {
    let data = req.body;

    if (!data) {
      res.status(400);
      throw new Error("Fill each data properly");
    }

    let checkArchive = await Archive.findById(req.params.id);
    if (checkArchive) {
      res.status(400);
      throw new Error("No archive found for provided id.");
    }

    const archive = await Archive.findByIdAndUpdate(req.params.id, data, {
      runValidators: true,
      new: true,
    });
    if (!archive) {
      res.status(400);
      throw new Error("Failed to update an entry in archive");
    }

    res.status(200).json({
      success: true,
      data: archive,
      message: "Archieve updated successfully.",
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server error: " + error);
  }
});

// @desc    Delete a Archive
// @route   DELETE /api/v1/archive/:id
// @access  SuperAdmin
const deleteArchive = asyncHandler(async (req, res) => {
  try {
    let archive = await Archive.findByIdAndDelete(req.params.id);

    if (!archive) {
      res.status(400);
      throw new Error("No archive entry found for provided id.");
    }

    res.status(204).json({
      success: true,
      data: {},
      message: "Archive entry deleted successfully.",
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server error: " + error);
  }
});

module.exports = {
  createArchive,
  getAllArchive,
  getSingleArchive,
  updateArchive,
  deleteArchive,
};
