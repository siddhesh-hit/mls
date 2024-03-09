const asyncHandler = require("express-async-handler");

const InterestArea = require("../../models/portals/InterestArea");
const Navigation = require("../../models/masters/Navigation");
const User = require("../../models/portals/userModel");

// @desc    Create a InterestArea
// @route   /api/v1/interest/
// @access  Admin
const createInterestArea = asyncHandler(async (req, res) => {
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
    const interestArea = await InterestArea.create(data);
    if (!interestArea) {
      res.status(400);
      throw new Error("InterestArea not created.");
    }

    res.status(201).json({
      message: "InterestArea created successfully.",
      data: interestArea,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get all InterestArea
// @route   /api/v1/interest/
// @access  Public
const getAllInterestArea = asyncHandler(async (req, res) => {
  try {
    const interestAreas = await InterestArea.find({})
      .populate("query", "marathi english isDropDown")
      .populate("userId", "full_name email")
      .exec();

    if (!interestAreas) {
      res.status(400);
      throw new Error("No InterestArea found.");
    }

    res.status(200).json({
      message: "InterestArea found successfully.",
      data: interestAreas,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get a InterestArea
// @route   /api/v1/interest/:id
// @access  Public
const getInterestArea = asyncHandler(async (req, res) => {
  try {
    const interestArea = await InterestArea.findById(req.params.id)
      .populate("query", "marathi english isDropDown")
      .populate("userId", "full_name email")
      .exec();

    if (!interestArea) {
      res.status(400);
      throw new Error("No InterestArea found.");
    }

    res.status(200).json({
      message: "InterestArea found successfully.",
      data: interestArea,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Update a InterestArea
// @route   /api/v1/interest/:id
// @access  Admin
const updateInterestArea = asyncHandler(async (req, res) => {
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
    const interestArea = await InterestArea.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    );

    if (!interestArea) {
      res.status(400);
      throw new Error("InterestArea not updated.");
    }

    res.status(200).json({
      message: "InterestArea updated successfully.",
      data: interestArea,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Delete a InterestArea
// @route   /api/v1/interest/:id
// @access  Admin
const deleteInterestArea = asyncHandler(async (req, res) => {
  try {
    const interestArea = await InterestArea.findByIdAndDelete(req.params.id);

    if (!interestArea) {
      res.status(400);
      throw new Error("No InterestArea found.");
    }

    res.status(204).json({
      message: "InterestArea deleted successfully.",
      data: {},
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

module.exports = {
  createInterestArea,
  getAllInterestArea,
  getInterestArea,
  updateInterestArea,
  deleteInterestArea,
};
