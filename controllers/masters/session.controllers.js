const asyncHandler = require("express-async-handler");

const SessionField = require("../../models/masters/SessionField");
const User = require("../../models/portals/userModel");

// @desc    Create a session
// @path    POST /api/sessionField/
// @access  Public
const createSessionField = asyncHandler(async (req, res) => {
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
    const sessionField = await SessionField.create(data);
    if (!sessionField) {
      res.status(400);
      throw new Error("Failed to create a session field");
    }

    res.status(201).json({
      data: sessionField,
      message: "Session field created!",
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error: " + error);
  }
});

// @desc    Get all session
// @path    GET /api/sessionField/
// @access  Public
const getSessionFields = asyncHandler(async (req, res) => {
  try {
    let { perPage, perLimit, ...id } = req.query;

    const pageOptions = {
      page: parseInt(perPage, 10) || 0,
      limit: parseInt(perLimit, 10) || 10,
    };

    const sessionField = await SessionField.find(id)
      .limit(pageOptions.limit)
      .skip(pageOptions.page * pageOptions.limit)
      .exec();

    // check if sessionField exists
    if (!sessionField) {
      res.status(404);
      throw new Error("No sessionFields found");
    }

    // send response
    res.status(200).json({
      message: "SessionFields fetched successfully",
      data: sessionField,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error: " + error);
  }
});

// @desc    Get a session
// @path    GET /api/sessionField/:id
// @access  Public
const getSessionField = asyncHandler(async (req, res) => {
  try {
    // check whether exists and send res
    const sessionField = await SessionField.findById(req.params.id);
    if (!sessionField) {
      res.status(400);
      throw new Error("No session field found for provided id.");
    }
    res.status(200).json({
      message: "SessionField fetched successfully.",
      data: sessionField,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error: " + error);
  }
});

// @desc    Update a session
// @path    PUT /api/sessionField/:id
// @access  Public
const updateSessionField = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    let userId = res.locals.userInfo;

    // validate
    if (!data.name) {
      res.status(400);
      throw new Error("Field data properly.");
    }

    // check if sessionfield exists
    const checkSessionField = await SessionField.findById(req.params.id);
    if (!checkSessionField) {
      res.status(400);
      throw new Error("Failed to find a sessionfield .");
    }

    // check if user exists and then add it
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }
    data.updatedBy = userId.id;

    // create an entry
    const sessionField = await SessionField.findByIdAndUpdate(
      req.params.id,
      data,
      { runValidators: true, new: true }
    );
    if (!sessionField) {
      res.status(400);
      throw new Error("Failed to update a session field");
    }

    res.status(200).json({
      data: sessionField,
      message: "Session field updated!",
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error: " + error);
  }
});

// @desc    Delete a session
// @path    DELETE /api/sessionField/:id
// @access  Public
const deleteSessionField = asyncHandler(async (req, res) => {
  try {
    // check whether exists and send res
    const sessionField = await SessionField.findByIdAndDelete(req.params.id);
    if (!sessionField) {
      res.status(400);
      throw new Error("No session field found for provided id.");
    }

    res.status(204).json({
      message: "SessionField deleted!",
      data: {},
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error: " + error);
  }
});

module.exports = {
  createSessionField,
  getSessionField,
  getSessionFields,
  updateSessionField,
  deleteSessionField,
};
