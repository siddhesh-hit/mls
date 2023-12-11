const asyncHandler = require("express-async-handler");

const Assembly = require("../../models/masters/assembly");

// @desc    Create a assembly
// @route   /api/assembly/
// @access  Admin
const createAssembly = asyncHandler(async (req, res) => {});

// @desc    Get all assembly
// @route   GET /api/assembly/
// @access  Public
const getAllAssembly = asyncHandler(async (req, res) => {});

// @desc    Get a assembly
// @route   GET /api/assembly/:id
// @access  Public
const getAssembly = asyncHandler(async (req, res) => {});

// @desc    Update a assembly
// @route   PUT /api/assembly/:id
// @access  Admin
const updateAssembly = asyncHandler(async (req, res) => {});

// @desc    Delete a assembly
// @route   DELETE /api/assembly/:id
// @access  Admin
const deleteAssembly = asyncHandler(async (req, res) => {});

module.exports = {
  createAssembly,
  getAllAssembly,
  getAssembly,
  updateAssembly,
  deleteAssembly,
};
