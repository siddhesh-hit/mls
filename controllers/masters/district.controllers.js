const asyncHandler = require("express-async-handler");

const District = require("../../models/masters/district");

// @desc    Create a District
// @route   /api/district/
// @access  Admin
const createDistrict = asyncHandler(async (req, res) => {});

// @desc    Get all District
// @route   GET /api/district/
// @access  Public
const getAllDistrict = asyncHandler(async (req, res) => {});

// @desc    Get a District
// @route   GET /api/district/:id
// @access  Public
const getDistrict = asyncHandler(async (req, res) => {});

// @desc    Update a District
// @route   PUT /api/district/:id
// @access  Admin
const updateDistrict = asyncHandler(async (req, res) => {});

// @desc    Delete a District
// @route   DELETE /api/district/:id
// @access  Admin
const deleteDistrict = asyncHandler(async (req, res) => {});

module.exports = {
  createDistrict,
  getAllDistrict,
  getDistrict,
  updateDistrict,
  deleteDistrict,
};
