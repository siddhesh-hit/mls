const asyncHandler = require("express-async-handler");

const Party = require("../../models/masters/politicalParty");

// @desc    Create a Party
// @route   /api/party/
// @access  Admin
const createParty = asyncHandler(async (req, res) => {});

// @desc    Get all Party
// @route   GET /api/party/
// @access  Public
const getAllParty = asyncHandler(async (req, res) => {});

// @desc    Get a Party
// @route   GET /api/party/:id
// @access  Public
const getParty = asyncHandler(async (req, res) => {});

// @desc    Update a Party
// @route   PUT /api/party/:id
// @access  Admin
const updateParty = asyncHandler(async (req, res) => {});

// @desc    Delete a Party
// @route   DELETE /api/party/:id
// @access  Admin
const deleteParty = asyncHandler(async (req, res) => {});

module.exports = {
  createParty,
  getAllParty,
  getParty,
  updateParty,
  deleteParty,
};
