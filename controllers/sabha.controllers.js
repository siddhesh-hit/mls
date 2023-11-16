const asyncHandler = require("express-async-handler");

const VidhanSabha = require("../models/vidhanSabha");
const {
  createVidhanSabhaValidation,
  updateVidhanSabhaValidation,
} = require("../validations/sabhaValidation");

// @desc    Create a vidhanSabha ==> /api/sabha
const createVidhanSabha = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    // const { banner_image_en, banner_image_mr } = req.files;

    // data.marathi.banner_image = banner_image_mr;
    // data.english.banner_image = banner_image_en;

    // validate data & files
    const { error } = createVidhanSabhaValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message, error);
    }

    // create vidhanSabha
    const vidhanSabha = await VidhanSabha.create(data);

    if (!vidhanSabha) {
      res.status(400);
      throw new Error("Something went wrong while creating the vidhanSabha.");
    }

    res.status(201).json({
      message: "VidhanSabha created successfully.",
      data: vidhanSabha,
    });

    console.log(data);
  } catch (error) {
    res.status(500);
    throw new Error(error.message, error);
  }
});

// @desc    Get all vidhanSabhas ==> /api/sabha
const getVidhanSabhas = asyncHandler(async (req, res) => {
  try {
    const vidhanSabhas = await VidhanSabha.find();

    if (!vidhanSabhas) {
      res.status(400);
      throw new Error("Something went wrong while getting the vidhanSabhas.");
    }

    res.status(200).json({
      message: "VidhanSabhas fetched successfully.",
      data: vidhanSabhas,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message, error);
  }
});

// @desc    Get single vidhanSabha by id ==> /api/sabha/:id
const getVidhanSabhaById = asyncHandler(async (req, res) => {
  try {
    const vidhanSabha = await VidhanSabha.findById(req.params.id);

    if (!vidhanSabha) {
      res.status(400);
      throw new Error("Something went wrong while getting the vidhanSabha.");
    }

    res.status(200).json({
      message: "VidhanSabha fetched successfully.",
      data: vidhanSabha,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message, error);
  }
});

// @desc    Update a vidhanSabha ==> /api/sabha/:id
const updateVidhanSabha = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    // const { banner_image_en, banner_image_mr } = req.files;

    // data.marathi.banner_image = banner_image_mr;
    // data.english.banner_image = banner_image_en;

    // validate data & files
    const { error } = updateVidhanSabhaValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message, error);
    }

    // check if vidhanSabha exists
    const vidhanSabhaExists = await VidhanSabha.findById(req.params.id);
    if (!vidhanSabhaExists) {
      res.status(400);
      throw new Error("VidhanSabha not found.");
    }

    // update vidhanSabha
    const vidhanSabha = await VidhanSabha.findByIdAndUpdate(
      req.params.id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!vidhanSabha) {
      res.status(400);
      throw new Error("Something went wrong while updating the vidhanSabha.");
    }

    res.status(200).json({
      message: "VidhanSabha updated successfully.",
      data: vidhanSabha,
    });

    console.log(data);
  } catch (error) {
    res.status(500);
    throw new Error(error.message, error);
  }
});

// @desc    Delete a vidhanSabha ==> /api/sabha/:id
const deleteVidhanSabha = asyncHandler(async (req, res) => {
  try {
    const vidhanSabha = await VidhanSabha.findByIdAndDelete(req.params.id);

    if (!vidhanSabha) {
      res.status(400);
      throw new Error("Something went wrong while deleting the vidhanSabha.");
    }

    res.status(200).json({
      message: "VidhanSabha deleted successfully.",
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message, error);
  }
});

module.exports = {
  getVidhanSabhas,
  getVidhanSabhaById,
  createVidhanSabha,
  updateVidhanSabha,
  deleteVidhanSabha,
};
