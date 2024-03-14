const asyncHandler = require("express-async-handler");

const ResetHead = require("../../models/reports/ResetHead");
const { default: mongoose } = require("mongoose");

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

    // filter the query
    let matchedQuery = {};

    for (key in id) {
      if (id[key] !== "") {
        id[key] = id[key].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        matchedQuery[key] = new RegExp(`.*${id[key]}.*`, "i");
      }
    }

    let resetHead = await ResetHead.aggregate([
      {
        $match: matchedQuery,
      },
      {
        $facet: {
          reset: [
            { $sort: { performed_on: -1 } },
            { $skip: pageOptions.page * pageOptions.limit },
            { $limit: pageOptions.limit },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    if (!resetHead) {
      res.status(400);
      throw new Error("No resethead entries found.");
    }

    res.status(200).json({
      message: "Resethead fetched successfully",
      success: true,
      data: resetHead[0]?.reset || [],
      count: resetHead[0]?.totalCount[0]?.count || 0,
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

// @desc    Retrieve the ResetHead
// @route   POST  /api/v1/reset/retrieve
// @access  SuperAdmin
const retrieveResetHead = asyncHandler(async (req, res) => {
  try {
    let id = req.body.id;
    if (!id) {
      res.status(400);
      throw new Error("Id not provided");
    }

    // check if resetHead exists or not
    let resetHead = await ResetHead.findById(id);
    if (!resetHead) {
      res.status(400);
      throw new Error("No entries for provided entry found");
    }

    let modelName = resetHead.modelName,
      modelId = resetHead.modelId;

    // retrieve the mongoose model dynamically
    let Model = mongoose.model(modelName);

    // check if model with model id exists
    let checkModelExists = await Model.findById(modelId);

    // if exists then update it
    if (checkModelExists) {
      let updatedModelData = await Model.findByIdAndUpdate(
        modelId,
        resetHead.data_object,
        { runValidators: true, new: true }
      );

      if (!updatedModelData) {
        res.status(400);
        throw new Error("Failed to update the model");
      }

      resetHead.isReverted++;
      await resetHead.save();

      res.status(200).json({
        message: `${modelName} update reverted!`,
        data: updatedModelData,
        success: true,
      });
    } else {
      // else create it
      let createModelData = await Model.create(resetHead.data_object);

      if (!createModelData) {
        res.status(400);
        throw new Error("Failed to update the model");
      }

      res.status(200).json({
        message: `${modelName} create reverted!`,
        data: createModelData,
        success: true,
      });
    }
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
  retrieveResetHead,
};
