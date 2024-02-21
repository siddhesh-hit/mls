const asyncHandler = require("express-async-handler");

const RequestAccess = require("../../models/portals/RequestAccess");
const Navigation = require("../../models/masters/Navigation");
const User = require("../../models/portals/userModel");

// @desc    Create a RequestAccess
// @route   /api/v1/request/
// @access  Admin
const createRequestAccess = asyncHandler(async (req, res) => {
  try {
    const data = req.body;

    if (!data && !data.query && !data.userId && !data.description) {
      res.status(400);
      throw new Error("Please provide each and every data");
    }

    const checkNavigation = await Navigation.findById(data.query);
    if (!checkNavigation) {
      res.status(400);
      throw new Error("Navigation doesn't exist");
    }

    const checkUser = await User.findById(data.userId);
    if (!checkUser) {
      res.status(400);
      throw new Error("User doesn't exist");
    }

    // create navigation
    const requestAccess = await RequestAccess.create(data);
    if (!requestAccess) {
      res.status(400);
      throw new Error("RequestAccess not created.");
    }

    res.status(201).json({
      message: "RequestAccess created successfully.",
      data: requestAccess,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get all RequestAccess
// @route   /api/v1/request/
// @access  Admin
const getAllRequestAccess = asyncHandler(async (req, res) => {
  try {
    const requestAccesses = await RequestAccess.find({})
      .populate("query", "marathi english isDropDown")
      .populate("userId", "full_name email")
      .exec();

    if (!requestAccesses) {
      res.status(400);
      throw new Error("No RequestAccess found.");
    }

    res.status(200).json({
      message: "RequestAccess found successfully.",
      data: requestAccesses,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get a RequestAccess
// @route   /api/v1/request/:id
// @access  Admin
const getRequestAccess = asyncHandler(async (req, res) => {
  try {
    const requestAccess = await RequestAccess.findById(req.params.id)
      .populate("query", "marathi english isDropDown")
      .populate("userId", "full_name email")
      .exec();

    if (!requestAccess) {
      res.status(400);
      throw new Error("No RequestAccess found.");
    }

    res.status(200).json({
      message: "RequestAccess found successfully.",
      data: requestAccess,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Update a RequestAccess
// @route   /api/v1/request/:id
// @access  Admin
const updateRequestAccess = asyncHandler(async (req, res) => {
  try {
    const data = req.body;

    if (!data && !data.query && !data.userId && !data.description) {
      res.status(400);
      throw new Error("Please provide each and every data");
    }

    const checkNavigation = await Navigation.findById(data.query);
    if (!checkNavigation) {
      res.status(400);
      throw new Error("Navigation doesn't exist");
    }

    const checkUser = await User.findById(data.userId);
    if (!checkUser) {
      res.status(400);
      throw new Error("User doesn't exist");
    }

    // create navigation
    const requestAccess = await RequestAccess.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    );
    if (!requestAccess) {
      res.status(400);
      throw new Error("RequestAccess not updated.");
    }

    res.status(200).json({
      message: "RequestAccess updated successfully.",
      data: requestAccess,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Delete a RequestAccess
// @route   /api/v1/request/:id
// @access  Admin
const deleteRequestAccess = asyncHandler(async (req, res) => {
  try {
    const requestAccess = await RequestAccess.findByIdAndDelete(req.params.id);

    if (!requestAccess) {
      res.status(400);
      throw new Error("No RequestAccess found.");
    }

    res.status(204).json({
      message: "RequestAccess deleted successfully.",
      data: {},
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

module.exports = {
  createRequestAccess,
  getAllRequestAccess,
  getRequestAccess,
  updateRequestAccess,
  deleteRequestAccess,
};
