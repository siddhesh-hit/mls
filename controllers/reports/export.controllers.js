const asyncHandler = require("express-async-handler");
const { mongoose } = require("mongoose");
const fs = require("fs");
const path = require("path");

// @desc    Get all exports
// @route   GET /api/v1/export
// @access  SuperAdmin
const getAllExport = asyncHandler(async (req, res) => {
  let { perPage, perLimit, ...id } = req.query;

  const pageOptions = {
    page: parseInt(perPage, 10) || 0,
    limit: parseInt(perLimit, 10) || 10,
  };

  // check if data exists
  let data = req.body;
  if (!data.modelName) {
    res.status(200);
    throw new Error("Model name is required!");
  }

  // get the model and return the data
  const Model = mongoose.model(data.modelName);
  const checkModelData = await Model.find(id);

  if (!checkModelData) {
    res.status(200).json({
      data: [],
      message: "No data found for provided model!",
      success: true,
    });
  }

  // write the data the in provided path

  res.status(200).json({
    data: checkModelData,
    message: "Data found successfully",
    success: true,
  });
});

// @desc    Get all exports
// @route   GET /api/v1/export
// @access  SuperAdmin
const getExportById = asyncHandler(async (req, res) => {});

module.exports = {
  getAllExport,
  getExportById,
};
