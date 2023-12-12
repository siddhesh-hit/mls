const asyncHandler = require("express-async-handler");

const District = require("../../models/masters/district");

const {
  createDistrictValidation,
  updateDistrictValidation,
} = require("../../validations/master/districtValidation");

// @desc    Create a District
// @route   /api/district/
// @access  Admin
const createDistrict = asyncHandler(async (req, res) => {
  try {
    let data = req.body;

    // validate the data
    const { error } = createDistrictValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // create district
    const district = await District.create(data);
    if (!district) {
      res.status(403);
      throw new Error("Couldn't create District.");
    }
    res.status(201).json({
      message: "District created successfully.",
      data: district,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get all District
// @route   GET /api/district/
// @access  Public
const getAllDistrict = asyncHandler(async (req, res) => {
  try {
    // find district
    const district = await District.find({});
    if (!district) {
      res.status(403);
      throw new Error("Couldn't find District.");
    }
    res.status(201).json({
      message: "District fetched successfully.",
      data: district,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get a District
// @route   GET /api/district/:id
// @access  Public
const getDistrict = asyncHandler(async (req, res) => {
  try {
    // find district
    const district = await District.findById(req.params.id);
    if (!district) {
      res.status(403);
      throw new Error("Couldn't find District.");
    }
    res.status(201).json({
      message: "District fetched successfully.",
      data: district,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Update a District
// @route   PUT /api/district/:id
// @access  Admin
const updateDistrict = asyncHandler(async (req, res) => {
  try {
    let data = req.body;

    // validate the data
    const { error } = updateDistrictValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // create district
    const district = await District.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!district) {
      res.status(403);
      throw new Error("Couldn't find District.");
    }
    res.status(201).json({
      message: "District updated successfully.",
      data: district,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Delete a District
// @route   DELETE /api/district/:id
// @access  Admin
const deleteDistrict = asyncHandler(async (req, res) => {
  try {
    // find district & delete
    const district = await District.findByIdAndDelete(req.params.id);
    if (!district) {
      res.status(403);
      throw new Error("Couldn't find District.");
    }
    res.status(201).json({
      message: "District deleted successfully.",
      data: district,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

module.exports = {
  createDistrict,
  getAllDistrict,
  getDistrict,
  updateDistrict,
  deleteDistrict,
};
