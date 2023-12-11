const asyncHandler = require("express-async-handler");

const Gender = require("../../models/masters/userGender");

// @desc    Create a Gender
// @route   /api/gender/
// @access  Admin
const createGender = asyncHandler(async (req, res) => {});

// @desc    Get all Gender
// @route   GET /api/gender/
// @access  Public
const getAllGender = asyncHandler(async (req, res) => {});

// @desc    Get a Gender
// @route   GET /api/gender/:id
// @access  Public
const getGender = asyncHandler(async (req, res) => {});

// @desc    Update a Gender
// @route   PUT /api/gender/:id
// @access  Admin
const updateGender = asyncHandler(async (req, res) => {});

// @desc    Delete a Gender
// @route   DELETE /api/gender/:id
// @access  Admin
const deleteGender = asyncHandler(async (req, res) => {});

module.exports = {
  createGender,
  getAllGender,
  getGender,
  updateGender,
  deleteGender,
};
