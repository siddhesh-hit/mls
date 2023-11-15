const asyncHandler = require("express-async-handler");
const VidhanSabha = require("../models/vidhanSabha");

// @desc    Create vidhan sabha ==> /api/sabha
const createVidhanSabha = asyncHandler(async (req, res) => {});

// @desc    Get all vidhan sabhas ==> /api/sabha
const getVidhanSabha = asyncHandler(async (req, res) => {});

// @desc    Get vidhan sabha by id ==> /api/sabha/:id
const getVidhanSabhaById = asyncHandler(async (req, res) => {});

// @desc    Update vidhan sabha ==> /api/sabha/:id
const updateVidhanSabha = asyncHandler(async (req, res) => {});

// @desc    Delete vidhan sabha ==> /api/sabha/:id
const deleteVidhanSabha = asyncHandler(async (req, res) => {});

module.exports = {
  createVidhanSabha,
  getVidhanSabha,
  getVidhanSabhaById,
  updateVidhanSabha,
  deleteVidhanSabha,
};
