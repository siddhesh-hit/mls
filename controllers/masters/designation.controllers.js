const asyncHandler = require("express-async-handler");

const Designation = require("../../models/masters/Designation");
const User = require("../../models/portals/userModel");

// @desc    Create a session
// @path    POST /api/designation/
// @access  Public
const createDesignation = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    let userId = res.locals.userInfo;

    // validate
    if (!data.name) {
      res.status(400);
      throw new Error("Field data properly.");
    }

    // check if user exists and then add it
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }
    data.createdBy = userId.id;

    // create an entry
    const designation = await Designation.create(data);
    if (!designation) {
      res.status(400);
      throw new Error("Failed to create a Designation");
    }

    res.status(201).json({
      data: designation,
      message: "Designation created!",
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error: " + error);
  }
});

// @desc    Get all session
// @path    GET /api/designation/
// @access  Public
const getDesignations = asyncHandler(async (req, res) => {
  try {
    let { perPage, perLimit, ...id } = req.query;

    const pageOptions = {
      page: parseInt(perPage, 10) || 0,
      limit: parseInt(perLimit, 10) || 10,
    };

    const designation = await Designation.find(id)
      .limit(pageOptions.limit)
      .skip(pageOptions.page * pageOptions.limit)
      .exec();

    // check if Ddesignation exists
    if (!designation) {
      res.status(404);
      throw new Error("No designations found");
    }

    // send response
    res.status(200).json({
      message: "Designations fetched successfully",
      data: designation,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error: " + error);
  }
});

// @desc    Get all master options
// @route   GET /api/designation/option
// @access  Public
const getAllOption = asyncHandler(async (req, res) => {
  try {
    const options = await Designation.find({}).select([
      "-isActive",
      "-status",
      "-createdBy",
      "-updatedBy",
      "-createdAt",
      "-updatedAt",
    ]);

    res.status(200).json({
      success: true,
      message: "All Department fetched!",
      data: options,
    });
  } catch (error) {
    throw new Error("Server error : " + error);
  }
});

// @desc    Get a session
// @path    GET /api/designation/:id
// @access  Public
const getDesignation = asyncHandler(async (req, res) => {
  try {
    // check whether exists and send res
    const designation = await Designation.findById(req.params.id);
    if (!designation) {
      res.status(400);
      throw new Error("No designation found for provided id.");
    }
    res.status(200).json({
      message: "Designation fetched successfully.",
      data: designation,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error: " + error);
  }
});

// @desc    Update a session
// @path    PUT /api/designation/:id
// @access  Public
const updateDesignation = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    let userId = res.locals.userInfo;

    // validate
    if (!data.name) {
      res.status(400);
      throw new Error("Field data properly.");
    }

    // check if Designation exists
    const checkDesignation = await Designation.findById(req.params.id);
    if (!checkDesignation) {
      res.status(400);
      throw new Error("Failed to find a Designation.");
    }

    // check if user exists and then add it
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }
    data.updatedBy = userId.id;

    // create an entry
    const designation = await Designation.findByIdAndUpdate(
      req.params.id,
      data,
      { runValidators: true, new: true }
    );
    if (!designation) {
      res.status(400);
      throw new Error("Failed to update a Designation");
    }

    res.status(200).json({
      data: designation,
      message: "Designation updated!",
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error: " + error);
  }
});

// @desc    Delete a session
// @path    DELETE /api/designation/:id
// @access  Public
const deleteDesignation = asyncHandler(async (req, res) => {
  try {
    // check whether exists and send res
    const designation = await Designation.findByIdAndDelete(req.params.id);
    if (!designation) {
      res.status(400);
      throw new Error("No designation found for provided id.");
    }

    res.status(204).json({
      message: "Designation deleted!",
      data: {},
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error: " + error);
  }
});

module.exports = {
  createDesignation,
  getDesignation,
  getAllOption,
  getDesignations,
  updateDesignation,
  deleteDesignation,
};
