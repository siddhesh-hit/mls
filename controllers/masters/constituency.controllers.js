const asyncHandler = require("express-async-handler");

const Constituency = require("../../models/masters/constituency");

// @desc    Create a Constituency
// @route   /api/constituency/
// @access  Admin
const createConstituency = asyncHandler(async (req, res) => {});

// @desc    Get all Constituency
// @route   GET /api/constituency/
// @access  Public
const getAllConstituency = asyncHandler(async (req, res) => {});

// @desc    Get a Constituency
// @route   GET /api/constituency/:id
// @access  Public
const getConstituency = asyncHandler(async (req, res) => {});

// @desc    Update a Constituency
// @route   PUT /api/constituency/:id
// @access  Admin
const updateConstituency = asyncHandler(async (req, res) => {});

// @desc    Delete a Constituency
// @route   DELETE /api/constituency/:id
// @access  Admin
const deleteConstituency = asyncHandler(async (req, res) => {});

module.exports = {
  createConstituency,
  getAllConstituency,
  getConstituency,
  updateConstituency,
  deleteConstituency,
};
