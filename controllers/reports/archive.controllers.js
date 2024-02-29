const asyncHandler = require("express-async-handler");

const Archive = require("../../models/reports/Archive");
const User = require("../../models/portals/userModel");
const { default: mongoose } = require("mongoose");

// @desc    Custom Create a Archive
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

// @desc    Create a Archive
// @route   POST /api/v1/archive/
// @access  SuperAdmin
const createArchiveApi = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    let userId = res.locals.userInfo;

    if (!data) {
      res.status(400);
      throw new Error("Fill each data properly");
    }

    // check if user exists and then add it
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }
    data.operation_by = userId.id;

    // get the model
    const Model = mongoose.model(data.modelName);

    // check if model data exists
    const checkModel = await Model.findById(data.modelId);
    if (!checkModel) {
      res.status(400);
      throw new Error(
        "Failed to find the data for provided id in the provided model"
      );
    }

    checkModel.status = "Archived";
    await checkModel.save();

    // create an entry in archive
    const archive = await Archive.create(data);
    if (!archive) {
      res.status(400);
      throw new Error("Failed to create an entry in archive");
    }

    res.status(200).json({
      success: true,
      data: archive,
      message: "Archieve created successfully.",
    });
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
    console.log(req.params.id);

    // console.log(data, "here");

    if (!data) {
      res.status(400);
      throw new Error("Fill each data properly");
    }

    let checkArchive = await Archive.findById(req.params.id);
    if (!checkArchive) {
      res.status(400);
      throw new Error("No archive found for provided id.");
    }

    // get the model
    const Model = mongoose.model(data.modelName);

    console.log(data.modelName, data.modelId);
    // check if model data exists
    const checkModel = await Model.findById(data.modelId);
    if (!checkModel) {
      res.status(400);
      throw new Error(
        "Failed to find the data for provided id in the provided model"
      );
    }

    checkModel.status = data?.data_object?.status;
    await checkModel.save();

    data.isReverted = true;
    data.revertedCount = data.revertedCount++;

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
  createArchiveApi,
  getAllArchive,
  getSingleArchive,
  updateArchive,
  deleteArchive,
};
