const asyncHandler = require("express-async-handler");

const Assembly = require("../../models/masters/assembly");

const {
  createAssemblyValidation,
  updateAssemblyValidation,
} = require("../../validations/master/assemblyValidation");

// @desc    Create a assembly
// @route   /api/v1/assembly/
// @access  Admin
const createAssembly = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    console.log(data);
    // validate the data
    const { error } = createAssemblyValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // create assembly
    let assembly = [];

    for (let i = 0; i < data.length; i++) {
      const createdAssembly = await Assembly.create(data[i]);
      if (!createdAssembly) {
        res.status(403);
        throw new Error("Couldn't create assembly.");
      }
      assembly.push(createAssembly);
    }

    res.status(201).json({
      message: "Assembly created successfully.",
      data: assembly,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get all assembly
// @route   GET /api/assembly/
// @access  Public
const getAllAssembly = asyncHandler(async (req, res) => {
  try {
    const assembly = await Assembly.find({});

    if (!assembly) {
      res.status(400);
      throw new Error("No assembly found.");
    }

    res.status(200).json({
      message: "Assembly created successfully.",

      success: true,
      data: assembly,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get a assembly
// @route   GET /api/assembly/:id
// @access  Public
const getAssembly = asyncHandler(async (req, res) => {
  try {
    const assembly = await Assembly.findById(req.params.id);

    if (!assembly) {
      res.status(400);
      throw new Error("No assembly found.");
    }

    res.status(200).json({
      message: "Assembly created successfully.",
      data: assembly,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Update a assembly
// @route   PUT /api/assembly/:id
// @access  Admin
const updateAssembly = asyncHandler(async (req, res) => {
  try {
    let data = req.body;

    console.log(data);
    // validate the data
    const { error } = updateAssemblyValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // update assembly
    const assembly = await Assembly.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!assembly) {
      res.status(404);
      throw new Error("No assembly found.");
    }
    res.status(200).json({
      message: "Assembly updated successfully.",
      data: assembly,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Delete a assembly
// @route   DELETE /api/assembly/:id
// @access  Admin
const deleteAssembly = asyncHandler(async (req, res) => {
  try {
    // find and delete
    const assembly = await Assembly.findByIdAndDelete(req.params.id);

    if (!assembly) {
      res.status(400);
      throw new Error("No assembly found.");
    }

    res.status(204).json({
      message: "Assembly deleted successfully.",
      data: {},
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

module.exports = {
  createAssembly,
  getAllAssembly,
  getAssembly,
  updateAssembly,
  deleteAssembly,
};
