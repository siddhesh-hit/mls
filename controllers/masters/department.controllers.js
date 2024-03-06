const asyncHandler = require("express-async-handler");

const Department = require("../../models/masters/Department");

// @desc    Create a Department
// @route   POST    /api/v1/department/
// @access  Admin
const createDepartment = asyncHandler(async (req, res) => {
  try {
  } catch (error) {
    res.status(500);
    throw new Error("Internal error: " + error);
  }
});

// @desc    Create a Department
// @route   GET     /api/v1/department/
// @access  Admin
const getDepartments = asyncHandler(async (req, res) => {
  try {
  } catch (error) {
    res.status(500);
    throw new Error("Internal error: " + error);
  }
});

// @desc    Create a Department
// @route   GET     /api/v1/department/
// @access  Admin
const getDepartment = asyncHandler(async (req, res) => {
  try {
  } catch (error) {
    res.status(500);
    throw new Error("Internal error: " + error);
  }
});

// @desc    Create a Department
// @route   PUT     /api/v1/department/
// @access  Admin
const updateDepartment = asyncHandler(async (req, res) => {
  try {
  } catch (error) {
    res.status(500);
    throw new Error("Internal error: " + error);
  }
});

// @desc    Create a Department
// @route   DELETE  /api/v1/department/
// @access  Admin
const deleteDepartment = asyncHandler(async (req, res) => {
  try {
  } catch (error) {
    res.status(500);
    throw new Error("Internal error: " + error);
  }
});

module.exports = {
  createDepartment,
  getDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
};
