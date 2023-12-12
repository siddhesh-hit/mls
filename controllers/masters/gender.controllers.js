const asyncHandler = require("express-async-handler");

const Gender = require("../../models/masters/userGender");

const {
  createGenderValidation,
  updateGenderValidation,
} = require("../../validations/master/genderValidation");

// @desc    Create a Gender
// @route   /api/gender/
// @access  Admin
const createGender = asyncHandler(async (req, res) => {
  try {
    let data = req.body;

    // validate the data
    const { error } = createGenderValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // create gender
    const gender = await Gender.create(data);
    if (!gender) {
      res.status(400);
      throw new Error("Gender not created.");
    }
    res.status(201).json({
      message: "Gender created successfully.",
      data: gender,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get all Gender
// @route   GET /api/gender/
// @access  Public
const getAllGender = asyncHandler(async (req, res) => {
  try {
    // find all
    const genders = await Gender.find({});

    if (!genders) {
      res.status(400);
      throw new Error("Gender not fetched.");
    }
    res.status(201).json({
      message: "Genders fetched successfully.",
      data: genders,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get a Gender
// @route   GET /api/gender/:id
// @access  Public
const getGender = asyncHandler(async (req, res) => {
  try {
    // find one
    const gender = await Gender.findById(req.params.id);

    if (!gender) {
      res.status(400);
      throw new Error("Gender not fetched.");
    }
    res.status(201).json({
      message: "Gender fetched successfully.",
      data: gender,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Update a Gender
// @route   PUT /api/gender/:id
// @access  Admin
const updateGender = asyncHandler(async (req, res) => {
  try {
    let data = req.body;

    // validate the data
    const { error } = updateGenderValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // update gender
    const gender = await Gender.findByIdAndUpdate(data);
    if (!gender) {
      res.status(400);
      throw new Error("Gender not created.");
    }
    res.status(201).json({
      message: "Gender updated successfully.",
      data: gender,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Delete a Gender
// @route   DELETE /api/gender/:id
// @access  Admin
const deleteGender = asyncHandler(async (req, res) => {
  try {
    // find one and delete
    const gender = await Gender.findByIdAndDelete(req.params.id);

    if (!gender) {
      res.status(400);
      throw new Error("Gender not fetched.");
    }
    res.status(201).json({
      message: "Gender fetched successfully.",
      data: gender,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

module.exports = {
  createGender,
  getAllGender,
  getGender,
  updateGender,
  deleteGender,
};
