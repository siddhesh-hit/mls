const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const joi = require("joi");

const MandalGallery = require("../models/mandalGallery");

// @desc    Create a mandal gallery ==> /api/gallery/
const createMandalGallery = asyncHandler(async (req, res) => {
  try {
    let file = req.file;

    // check if file is present
    if (!file) {
      res.status(400);
      throw new Error("Please upload a file");
    }

    console.log(file);

    // check validation
    const imageValidate = (data) => {
      const schema = joi.object({
        fieldname: joi.string().required(),
        originalname: joi.string().required(),
        encoding: joi.string().required(),
        mimetype: joi.string().required(),
        destination: joi.string().required(),
        filename: joi.string().required(),
        path: joi.string().required(),
        size: joi.number().required(),
      });
      return schema.validate(data);
    };

    const { error } = imageValidate(req.file);

    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // create mandal gallery
    const gallery = await MandalGallery.create(file);

    if (!gallery) {
      res.status(400);
      throw new Error("Failed to create Vidhan Mandal gallery");
    }

    res.status(201).json({
      message: "Vidhan Mandal gallery created successfully.",
      data: gallery,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error" + error);
  }
});

// @desc    Get all mandal galleries ==> /api/gallery/
const getAllMandalGalleries = asyncHandler(async (req, res) => {
  try {
    const gallery = await MandalGallery.find({});

    if (!gallery) {
      res.status(404);
      throw new Error("No Vidhan Mandal images found");
    }

    res.status(200).json({
      message: "Vidhan Mandal gallery fetched successfully.",
      data: gallery,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error" + error);
  }
});

// @desc    Get a mandal gallery by id ==> /api/gallery/:id
const getMandalGalleryById = asyncHandler(async (req, res) => {
  try {
    const gallery = await MandalGallery.findById(req.params.id);

    if (!gallery) {
      res.status(404);
      throw new Error("No Vidhan Mandal images found");
    }

    res.status(200).json({
      message: "Vidhan Mandal gallery fetched successfully.",
      data: gallery,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error" + error);
  }
});

// @desc    Update a mandal gallery by id ==> /api/gallery/:id
const updateMandalGallery = asyncHandler(async (req, res) => {
  try {
    let file = req.file;

    // check if file is present
    if (!file) {
      res.status(400);
      throw new Error("Please upload a file");
    }

    // check validation
    const imageValidate = (data) => {
      const schema = joi.object({
        fieldname: joi.string().required(),
        originalname: joi.string().required(),
        encoding: joi.string().required(),
        mimetype: joi.string().required(),
        destination: joi.string().required(),
        filename: joi.string().required(),
        path: joi.string().required(),
        size: joi.number().required(),
      });
      return schema.validate(data);
    };

    const { error } = imageValidate(req.file);

    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // create mandal gallery
    const gallery = await MandalGallery.findByIdAndUpdate(req.params.id, file, {
      new: true,
      runValidators: true,
    });

    if (!gallery) {
      res.status(400);
      throw new Error("Failed to update Vidhan Mandal gallery");
    }

    res.status(201).json({
      message: "Vidhan Mandal gallery updated successfully.",
      data: gallery,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error" + error);
  }
});

// @desc    Delete a mandal gallery by id ==> /api/gallery/:id
const deleteMandalGallery = asyncHandler(async (req, res) => {
  try {
    const gallery = await MandalGallery.findByIdAndDelete(req.params.id);

    if (!gallery) {
      res.status(404);
      throw new Error("No Vidhan Mandal images found");
    }

    res.status(200).json({
      message: "Vidhan Mandal gallery deleted successfully.",
      data: {},
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error" + error);
  }
});

module.exports = {
  getAllMandalGalleries,
  getMandalGalleryById,
  createMandalGallery,
  updateMandalGallery,
  deleteMandalGallery,
};
