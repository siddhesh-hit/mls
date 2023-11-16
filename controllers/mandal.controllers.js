const asyncHandler = require("express-async-handler");

const VidhanMandal = require("../models/vidhanMandal");

const {
  createVidhanMandalValidation,
  updateVidhanMandalValidation,
} = require("../validations/mandalValidation");

// @desc    Create a vidhan mandal ==> /api/mandal/
const createVidhanMandal = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    let files = req.files;

    // check if files are empty
    if (!files) {
      res.status(400);
      throw new Error("No files found");
    }

    // validate data & files
    const { error } = createVidhanMandalValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message, error);
    }

    // create vidhan mandal
    const vidhanMandal = await VidhanMandal.create(data);

    if (!vidhanMandal) {
      res.status(400);
      throw new Error("Something went wrong while creating the Vidhan Mandal.");
    }

    res.status(201).json({
      message: "Vidhan Mandal created successfully.",
      data: vidhanMandal,
    });

    console.log(data);
  } catch (error) {
    res.status(500);
    throw new Error(error.message, error);
  }
});

// @desc    Get all vidhan mandals ==> /api/mandal/
const getVidhanMandals = asyncHandler(async (req, res) => {
  try {
    const vidhanMandals = await VidhanMandal.find({});

    if (!vidhanMandals) {
      res.status(404);
      throw new Error("No Vidhan Mandal found");
    }

    res.status(200).json({
      message: "Vidhan Mandal fetched successfully.",
      data: vidhanMandals,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error" + error);
  }
});

// @desc    Get a vidhan mandal by id ==> /api/mandal/:id
const getVidhanMandalById = asyncHandler(async (req, res) => {
  try {
    const vidhanMandal = await VidhanMandal.findById(req.params.id);

    if (!vidhanMandal) {
      res.status(404);
      throw new Error("No Vidhan Mandal found");
    }

    res.status(200).json({
      message: "Vidhan Mandal fetched successfully.",
      data: vidhanMandal,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error" + error);
  }
});

// @desc    Update a vidhan mandal by id ==> /api/mandal/:id
const updateVidhanMandal = asyncHandler(async (req, res) => {
  try {
    const data = req.body;

    // validate data & files
    const { error } = updateVidhanMandalValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message, error);
    }

    // check if vidhan mandal exists
    const vidhanMandal = await VidhanMandal.findById(req.params.id);
    if (!vidhanMandal) {
      res.status(404);
      throw new Error("No Vidhan Mandal found");
    }

    // update vidhan mandal
    const updatedVidhanMandal = await VidhanMandal.findByIdAndUpdate(
      req.params.id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedVidhanMandal) {
      res.status(400);
      throw new Error("Something went wrong while updating the Vidhan Mandal.");
    }

    res.status(200).json({
      message: "Vidhan Mandal updated successfully.",
      data: updatedVidhanMandal,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error" + error);
  }
});

// @desc    Delete a vidhan mandal by id ==> /api/mandal/:id
const deleteVidhanMandal = asyncHandler(async (req, res) => {
  try {
    const vidhanMandal = await VidhanMandal.findById(req.params.id);

    if (!vidhanMandal) {
      res.status(404);
      throw new Error("No Vidhan Mandal found");
    }

    await vidhanMandal.remove();

    res.status(200).json({
      message: "Vidhan Mandal deleted successfully.",
      data: vidhanMandal,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error" + error);
  }
});

module.exports = {
  getVidhanMandals,
  getVidhanMandalById,
  createVidhanMandal,
  updateVidhanMandal,
  deleteVidhanMandal,
};
