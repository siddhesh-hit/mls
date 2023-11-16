const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const MandalGallery = require("../models/mandalGallery");

// @desc    Get all mandal galleries ==> /api/gallery/
const getAllMandalGalleries = asyncHandler(async (req, res) => {});

// @desc    Get a mandal gallery by id ==> /api/gallery/:id
const getMandalGalleryById = asyncHandler(async (req, res) => {});

// @desc    Create a mandal gallery ==> /api/gallery/
const createMandalGallery = asyncHandler(async (req, res) => {});

// @desc    Update a mandal gallery by id ==> /api/gallery/:id
const updateMandalGallery = asyncHandler(async (req, res) => {});

// @desc    Delete a mandal gallery by id ==> /api/gallery/:id
const deleteMandalGallery = asyncHandler(async (req, res) => {});

module.exports = {
  getAllMandalGalleries,
  getMandalGalleryById,
  createMandalGallery,
  updateMandalGallery,
  deleteMandalGallery,
};
