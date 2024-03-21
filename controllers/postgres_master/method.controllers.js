const asyncHandler = require("express-async-handler");

const Method = require("../../models/postgres_master/Document_Method");
const MethodType = require("../../models/postgres_master/Document_Method_Type");
const MethodSubType = require("../../models/postgres_master/Document_Method_Sub_Type");

// @desc    Get all Method
// @route   GET /api/v1/master/method
// @access  SuperAdmin
const getMethod = asyncHandler(async (req, res) => {
  try {
    let { ...queries } = req.query;
    let matchConditions = {};

    for (let key in queries) {
      if (queries[key]) {
        // key = queries[key].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        matchConditions[key] = queries[key];
      }
    }

    let methods = await Method.find(matchConditions);

    res.status(200).json({
      success: true,
      message: "Method fetched!",
      data: methods,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server error: " + error);
  }
});

// @desc    Get all Method type
// @route   GET /api/v1/master/methodtype
// @access  SuperAdmin
const getMethodType = asyncHandler(async (req, res) => {
  try {
    let { ...queries } = req.query;
    let matchConditions = {};

    for (let key in queries) {
      if (queries[key]) {
        // key = queries[key].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        matchConditions[key] = queries[key];
      }
    }

    let methods = await MethodType.find(matchConditions);

    res.status(200).json({
      success: true,
      message: "Method Type fetched!",
      data: methods,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server error: " + error);
  }
});

// @desc    Get all Method Sub type
// @route   GET /api/v1/master/methodsubtype
// @access  SuperAdmin
const getMethodSubType = asyncHandler(async (req, res) => {
  try {
    let { ...queries } = req.query;
    let matchConditions = {};

    for (let key in queries) {
      if (queries[key]) {
        // key = queries[key].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        matchConditions[key] = queries[key];
      }
    }

    let methods = await MethodSubType.find(matchConditions);

    res.status(200).json({
      success: true,
      message: "Method Sub Type fetched!",
      data: methods,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server error: " + error);
  }
});

module.exports = {
  getMethod,
  getMethodType,
  getMethodSubType,
};
