const asyncHandler = require("express-async-handler");

const Constituency = require("../../models/masters/constituency");

const {
  createConstituencyValidation,
  updateConstituencyValidation,
} = require("../../validations/master/constituencyValidation");

// @desc    Create a Constituency
// @route   /api/constituency/
// @access  Admin
const createConstituency = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    console.log(data);

    // validate the data
    // const { error } = createConstituencyValidation(data);
    // if (error) {
    //   res.status(400);
    //   throw new Error(error.details[0].message);
    // }

    // // create constituency
    // let constituency = [];

    // for (let i = 0; i < data.length; i++) {
    //   constituency.push(createdConstituency);
    // }

    const createdConstituency = await Constituency.create(data);
    if (!createConstituency) {
      res.status(403);
      throw new Error("Couldn't create Constituency.");
    }
    res.status(201).json({
      message: "Constituency created successfully.",
      data: createdConstituency,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get all Constituency
// @route   GET /api/constituency/
// @access  Public
const getAllConstituency = asyncHandler(async (req, res) => {
  try {
    const constituency = await Constituency.find({});
    if (!constituency) {
      res.status(403);
      throw new Error("Couldn't find Constituency.");
    }
    res.status(200).json({
      message: "Constituency fetched successfully.",
      data: constituency,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get a Constituency
// @route   GET /api/constituency/:id
// @access  Public
const getConstituency = asyncHandler(async (req, res) => {
  try {
    const constituency = await Constituency.findById(req.params.id);
    if (!constituency) {
      res.status(403);
      throw new Error("Couldn't find Constituency.");
    }
    res.status(200).json({
      message: "Constituency fetched successfully.",
      data: constituency,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Update a Constituency
// @route   PUT /api/constituency/:id
// @access  Admin
const updateConstituency = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    console.log(data);
    // validate the data
    const { error } = updateConstituencyValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // update constituency
    const constituency = await Constituency.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    );
    if (!constituency) {
      res.status(403);
      throw new Error("Couldn't create Constituency.");
    }
    res.status(200).json({
      message: "Constituency created successfully.",
      data: constituency,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Delete a Constituency
// @route   DELETE /api/constituency/:id
// @access  Admin
const deleteConstituency = asyncHandler(async (req, res) => {
  try {
    // find and delete
    const constituency = await Constituency.findByIdAndDelete(req.params.id);
    if (!constituency) {
      res.status(403);
      throw new Error("Couldn't find Constituency.");
    }
    res.status(204).json({
      message: "Constituency deleted successfully.",
      data: {},
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

module.exports = {
  createConstituency,
  getAllConstituency,
  getConstituency,
  updateConstituency,
  deleteConstituency,
};
