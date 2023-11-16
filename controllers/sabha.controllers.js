const asyncHandler = require("express-async-handler");

const VidhanSabha = require("../models/vidhanSabha");

// @desc    Create a vidhanSabha ==> /api/sabha
const createVidhanSabha = asyncHandler(async (req, res) => {
  try {
    const data = req.body;
  } catch (error) {
    res.status(500).json({
      message:
        error.message || "Something went wrong while creating the vidhanSabha.",
    });
  }
});

// @desc    Get all vidhanSabhas ==> /api/sabha
const getVidhanSabhas = asyncHandler(async (req, res) => {});

// @desc    Get single vidhanSabha by id ==> /api/sabha/:id
const getVidhanSabhaById = asyncHandler(async (req, res) => {});

// @desc    Update a vidhanSabha ==> /api/sabha/:id
const updateVidhanSabha = asyncHandler(async (req, res) => {});

// @desc    Delete a vidhanSabha ==> /api/sabha/:id
const deleteVidhanSabha = asyncHandler(async (req, res) => {});

module.exports = {
  getVidhanSabhas,
  getVidhanSabhaById,
  createVidhanSabha,
  updateVidhanSabha,
  deleteVidhanSabha,
};
