const asyncHandler = require("express-async-handler");

const Navigation = require("../../models/masters/Navigation");

const {
  createNavigationValidation,
  updateNavigationValidation,
} = require("../../validations/master/navigationValidation");

// @desc    Create a Navigation
// @route   /api/navigation/
// @access  Admin
const createNavigation = asyncHandler(async (req, res) => {
  try {
    const data = req.body;

    let formattedData = {};

    if (!data) {
      res.status(400);
      throw new Error("Please provide data");
    }

    if (data.isDropDown) {
      formattedData = data;
    } else {
      let object = {
        marathi: {
          navigation: data.marathi.navigation,
        },
        english: {
          navigation: data.english.navigation,
        },
        isDropDown: data.isDropDown,
      };
      formattedData = object;
    }

    console.log(formattedData);

    // // validate the data
    // const { error } = createNavigationValidation(data);
    // if (error) {
    //   res.status(400);
    //   throw new Error(error.details[0].message);
    // }

    // create navigation
    const navigate = await Navigation.create(formattedData);
    if (!navigate) {
      res.status(400);
      throw new Error("Navigate not created.");
    }

    res.status(201).json({
      message: "Navigate created successfully.",
      data: navigate,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get all Navigation
// @route   /api/navigation/
// @access  Public
const getAllNavigation = asyncHandler(async (req, res) => {
  try {
    const navigations = await Navigation.find({});

    if (!navigations) {
      res.status(400);
      throw new Error("No navigation found.");
    }

    res.status(200).json({
      message: "Navigation found successfully.",
      data: navigations,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get a Navigation
// @route   /api/navigation/:id
// @access  Public
const getNavigation = asyncHandler(async (req, res) => {
  try {
    const navigation = await Navigation.findById(req.params.id);

    if (!navigation) {
      res.status(400);
      throw new Error("Navigation not found.");
    }

    res.status(200).json({
      message: "Navigation found successfully.",
      data: navigation,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Update a Navigation
// @route   /api/navigation/:id
// @access  Admin
const updateNavigation = asyncHandler(async (req, res) => {
  try {
    const data = req.body;

    // validate the data
    const { error } = updateNavigationValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    const navigationExist = await Navigation.findById(req.params.id);
    if (!navigationExist) {
      res.status(400);
      throw new Error("Navigation not found.");
    }

    const updatedNavigation = await Navigation.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    );

    if (!updateNavigation) {
      res.status(400);
      throw new Error("Failed to updated navigation");
    }

    res.status(200).json({
      message: "Navigation updated successfully",
      data: updateNavigation,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Delete a Navigation
// @route   /api/navigation/:id
// @access  Admin
const deleteNavigation = asyncHandler(async (req, res) => {
  try {
    const navigation = await Navigation.findByIdAndDelete(req.params.id);

    if (!navigation) {
      res.status(400);
      throw new Error("Navigation not found.");
    }

    res.status(200).json({
      message: "Navigation deleted successfully.",
      data: {},
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

module.exports = {
  createNavigation,
  getAllNavigation,
  getNavigation,
  updateNavigation,
  deleteNavigation,
};
