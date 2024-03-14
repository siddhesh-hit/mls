const asyncHandler = require("express-async-handler");

const LegislationPosition = require("../../models/masters/LegislationPosition");
const User = require("../../models/portals/userModel");

// @desc    Create a session
// @path    POST /api/position/
// @access  Public
const createLegislationPosition = asyncHandler(async (req, res) => {
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
    const legislationPosition = await LegislationPosition.create(data);
    if (!legislationPosition) {
      res.status(400);
      throw new Error("Failed to create a LegislationPosition");
    }

    res.status(201).json({
      data: legislationPosition,
      message: "LegislationPosition created!",
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error: " + error);
  }
});

// @desc    Get all session
// @path    GET /api/position/
// @access  Public
const getLegislationPositions = asyncHandler(async (req, res) => {
  try {
    let { perPage, perLimit, ...id } = req.query;

    const pageOptions = {
      page: parseInt(perPage, 10) || 0,
      limit: parseInt(perLimit, 10) || 10,
    };

    const legislationPosition = await LegislationPosition.find(id)
      .limit(pageOptions.limit)
      .skip(pageOptions.page * pageOptions.limit)
      .exec();

    // check if LegislationPosition exists
    if (!legislationPosition) {
      res.status(404);
      throw new Error("No LegislationPositions found");
    }

    // send response
    res.status(200).json({
      message: "LegislationPositions fetched successfully",
      data: legislationPosition,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error: " + error);
  }
});

// @desc    Get all master options
// @route   GET /api/position/option
// @access  Public
const getAllOption = asyncHandler(async (req, res) => {
  try {
    const options = await LegislationPosition.find({}).select([
      "-isActive",
      "-status",
      "-createdBy",
      "-updatedBy",
      "-createdAt",
      "-updatedAt",
    ]);

    res.status(200).json({
      success: true,
      message: "All Legislation Position fetched!",
      data: options,
    });
  } catch (error) {
    throw new Error("Server error : " + error);
  }
});

// @desc    Get a session
// @path    GET /api/position/:id
// @access  Public
const getLegislationPosition = asyncHandler(async (req, res) => {
  try {
    // check whether exists and send res
    const legislationPosition = await LegislationPosition.findById(
      req.params.id
    );
    if (!legislationPosition) {
      res.status(400);
      throw new Error("No LegislationPosition found for provided id.");
    }

    res.status(200).json({
      message: "LegislationPosition fetched successfully.",
      data: legislationPosition,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error: " + error);
  }
});

// @desc    Update a session
// @path    PUT /api/position/:id
// @access  Public
const updateLegislationPosition = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    let userId = res.locals.userInfo;

    // validate
    if (!data.name) {
      res.status(400);
      throw new Error("Field data properly.");
    }

    // check if LegislationPosition exists
    const checkLegislationPosition = await LegislationPosition.findById(
      req.params.id
    );
    if (!checkLegislationPosition) {
      res.status(400);
      throw new Error("Failed to find a LegislationPosition.");
    }

    // check if user exists and then add it
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }
    data.updatedBy = userId.id;

    // create an entry
    const legislationPosition = await LegislationPosition.findByIdAndUpdate(
      req.params.id,
      data,
      { runValidators: true, new: true }
    );
    if (!legislationPosition) {
      res.status(400);
      throw new Error("Failed to update a session field");
    }

    res.status(200).json({
      data: legislationPosition,
      message: "LegislationPosition updated!",
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error: " + error);
  }
});

// @desc    Delete a session
// @path    DELETE /api/position/:id
// @access  Public
const deleteLegislationPosition = asyncHandler(async (req, res) => {
  try {
    // check whether exists and send res
    const legislationPosition = await LegislationPosition.findByIdAndDelete(
      req.params.id
    );
    if (!legislationPosition) {
      res.status(400);
      throw new Error("No LegislationPosition found for provided id.");
    }

    res.status(204).json({
      message: "LegislationPosition deleted!",
      data: {},
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error: " + error);
  }
});

module.exports = {
  createLegislationPosition,
  getLegislationPosition,
  getAllOption,
  getLegislationPositions,
  updateLegislationPosition,
  deleteLegislationPosition,
};
