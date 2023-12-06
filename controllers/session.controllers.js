const asyncHandler = require("express-async-handler");

const SessionCalendar = require("../models/sessionCalendar");
const {
  createSessionCalendarValidation,
  updateSessionCalendarValidation,
} = require("../validations/sessionValidation");

// @desc    Create a session calendar
// @route   POST /api/session/
// @access  Admin
const createSession = asyncHandler(async (req, res) => {});

// @desc    Get all session calendar
// @route   GET /api/session/
// @access  Public
const getAllSession = asyncHandler(async (req, res) => {});

// @desc    Get a session calendar
// @route   GET /api/session/
// @access  Public
const getSession = asyncHandler(async (req, res) => {});

// @desc    Update a session calendar
// @route   PUT /api/session/
// @access  Admin
const updateSession = asyncHandler(async (req, res) => {});

// @desc    Delete a session calendar
// @route   DELETE /api/session/
// @access  Admin
const deleteSession = asyncHandler(async (req, res) => {});

module.exports = {
  createSession,
  getAllSession,
  getSession,
  updateSession,
  deleteSession,
};
