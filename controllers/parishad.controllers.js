const asyncHandler = require("express-async-handler");

const VidhanParishad = require("../models/vidhanParishad");
const {
  createVidhanParishadValidation,
  updateVidhanParishadValidation,
} = require("../validations/parishadValidation");

// @desc    Create a vidhanParishad ==> /api/vidhanParishad/
const createVidhanParishad = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    // let { banner_image_en, banner_image_mr } = req.files;

    // data.marathi.banner_image = banner_image_mr;
    // data.english.banner_image = banner_image_en;

    // validate data & files
    const { error } = createVidhanParishadValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message, error);
    }

    // create vidhanParishad
    const vidhanParishad = await VidhanParishad.create(data);

    if (!vidhanParishad) {
      res.status(400);
      throw new Error(
        "Something went wrong while creating the VidhanParishad."
      );
    }

    res.status(201).json({
      message: "VidhanParishad created successfully.",
      data: vidhanParishad,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message, error);
  }
});

// @desc    Get all vidhanParishads ==> /api/vidhanParishad/
const getVidhanParishads = asyncHandler(async (req, res) => {
  try {
    const vidhanParishads = await VidhanParishad.find();

    if (!vidhanParishads) {
      res.status(400);
      throw new Error(
        "Something went wrong while getting the VidhanParishads."
      );
    }

    res.status(200).json({
      message: "VidhanParishads fetched successfully.",
      data: vidhanParishads,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message, error);
  }
});

// @desc    Get vidhanParishad by id ==> /api/vidhanParishad/:id
const getVidhanParishadById = asyncHandler(async (req, res) => {
  try {
    const vidhanParishad = await VidhanParishad.findById(req.params.id);

    if (!vidhanParishad) {
      res.status(400);
      throw new Error("Something went wrong while getting the VidhanParishad.");
    }

    res.status(200).json({
      message: "VidhanParishad fetched successfully.",
      data: vidhanParishad,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message, error);
  }
});

// @desc    Update a vidhanParishad ==> /api/vidhanParishad/:id
const updateVidhanParishad = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    // let { banner_image_en, banner_image_mr } = req.files;

    // data.marathi.banner_image = banner_image_mr;
    // data.english.banner_image = banner_image_en;

    // validate data & files
    const { error } = updateVidhanParishadValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message, error);
    }

    // check if vidhanParishad exists
    const vidhanParishadExists = await VidhanParishad.findById(req.params.id);
    if (!vidhanParishadExists) {
      res.status(400);
      throw new Error("VidhanParishad not found.");
    }

    // update vidhanParishad
    const vidhanParishad = await VidhanParishad.findByIdAndUpdate(
      req.params.id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!vidhanParishad) {
      res.status(400);
      throw new Error(
        "Something went wrong while updating the VidhanParishad."
      );
    }

    res.status(200).json({
      message: "VidhanParishad updated successfully.",
      data: vidhanParishad,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message, error);
  }
});

// @desc    Delete a vidhanParishad ==> /api/vidhanParishad/:id
const deleteVidhanParishad = asyncHandler(async (req, res) => {
  try {
    const vidhanParishad = await VidhanParishad.findByIdAndDelete(
      req.params.id
    );

    if (!vidhanParishad) {
      res.status(400);
      throw new Error(
        "Something went wrong while deleting the VidhanParishad."
      );
    }

    res.status(200).json({
      message: "VidhanParishad deleted successfully.",
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message, error);
  }
});

module.exports = {
  getVidhanParishads,
  getVidhanParishadById,
  createVidhanParishad,
  updateVidhanParishad,
  deleteVidhanParishad,
};
