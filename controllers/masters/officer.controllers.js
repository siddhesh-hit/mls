const asyncHandler = require("express-async-handler");

const PresidingOfficer = require("../../models/masters/PresidingOfficer");
const User = require("../../models/portals/userModel");

// @desc    Create a session
// @path    POST /api/officer/
// @access  Public
const createPresidingOfficer = asyncHandler(async (req, res) => {
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
    const presidingOfficer = await PresidingOfficer.create(data);
    if (!presidingOfficer) {
      res.status(400);
      throw new Error("Failed to create a PresidingOfficer");
    }

    res.status(201).json({
      data: presidingOfficer,
      message: "PresidingOfficer created!",
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error: " + error);
  }
});

// @desc    Get all session
// @path    GET /api/officer/
// @access  Public
const getPresidingOfficers = asyncHandler(async (req, res) => {
  try {
    let { perPage, perLimit, ...id } = req.query;

    const pageOptions = {
      page: parseInt(perPage, 10) || 0,
      limit: parseInt(perLimit, 10) || 10,
    };

    const presidingOfficer = await PresidingOfficer.find(id)
      .limit(pageOptions.limit)
      .skip(pageOptions.page * pageOptions.limit)
      .exec();

    // check if DPresidingOfficer exists
    if (!presidingOfficer) {
      res.status(404);
      throw new Error("No PresidingOfficers found");
    }

    // send response
    res.status(200).json({
      message: "PresidingOfficers fetched successfully",
      data: presidingOfficer,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error: " + error);
  }
});

// @desc    Get a session
// @path    GET /api/officer/:id
// @access  Public
const getPresidingOfficer = asyncHandler(async (req, res) => {
  try {
    // check whether exists and send res
    const presidingOfficer = await PresidingOfficer.findById(req.params.id);
    if (!presidingOfficer) {
      res.status(400);
      throw new Error("No PresidingOfficer found for provided id.");
    }

    res.status(200).json({
      message: "PresidingOfficer fetched successfully.",
      data: presidingOfficer,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error: " + error);
  }
});

// @desc    Update a session
// @path    PUT /api/officer/:id
// @access  Public
const updatePresidingOfficer = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    let userId = res.locals.userInfo;

    // validate
    if (!data.name) {
      res.status(400);
      throw new Error("Field data properly.");
    }

    // check if PresidingOfficer exists
    const checkPresidingOfficer = await PresidingOfficer.findById(
      req.params.id
    );
    if (!checkPresidingOfficer) {
      res.status(400);
      throw new Error("Failed to find a PresidingOfficer.");
    }

    // check if user exists and then add it
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }
    data.updatedBy = userId.id;

    // create an entry
    const presidingOfficer = await PresidingOfficer.findByIdAndUpdate(
      req.params.id,
      data,
      { runValidators: true, new: true }
    );
    if (!presidingOfficer) {
      res.status(400);
      throw new Error("Failed to update a session field");
    }

    res.status(200).json({
      data: presidingOfficer,
      message: "PresidingOfficer updated!",
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error: " + error);
  }
});

// @desc    Delete a session
// @path    DELETE /api/officer/:id
// @access  Public
const deletePresidingOfficer = asyncHandler(async (req, res) => {
  try {
    // check whether exists and send res
    const presidingOfficer = await PresidingOfficer.findByIdAndDelete(
      req.params.id
    );
    if (!presidingOfficer) {
      res.status(400);
      throw new Error("No PresidingOfficer found for provided id.");
    }

    res.status(204).json({
      message: "PresidingOfficer deleted!",
      data: {},
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error: " + error);
  }
});

module.exports = {
  createPresidingOfficer,
  getPresidingOfficer,
  getPresidingOfficers,
  updatePresidingOfficer,
  deletePresidingOfficer,
};
