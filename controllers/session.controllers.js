const asyncHandler = require("express-async-handler");

const SessionCalendar = require("../models/sessionCalendar");
const {
  createSessionCalendarValidation,
  updateSessionCalendarValidation,
} = require("../validations/sessionValidation");

const notificationGenerator = require("../utils/notification");

// @desc    Create a session calendar
// @route   POST /api/session/
// @access  Admin
const createSession = asyncHandler(async (req, res) => {
  try {
    let data = req.body;

    data.marathi = JSON.parse(data.marathi);
    data.english = JSON.parse(data.english);

    let { document } = req.files;

    // check if document exists
    if (!document) {
      res.status(400);
      throw new Error("Document is required!");
    }

    // add document to the data
    for (let i = 0; i < data.length; i++) {
      data[i].document = document[i];
    }

    // validate the data
    const { error } = createSessionCalendarValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // create session calendar
    const sessionCalendar = await SessionCalendar.create(data);

    if (!sessionCalendar) {
      res.status(400);
      throw new Error(
        "Something went wrong while creating the Session Calendar."
      );
    }

    await notificationGenerator(
      "Session Calendar",
      "New Session Calendar added!",
      res
    );

    res.status(201).json({
      message: "Session Calendar created successfully.",
      data: sessionCalendar,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get all session calendar
// @route   GET /api/session/
// @access  Public
const getAllSession = asyncHandler(async (req, res) => {
  try {
    const sessionCalendar = await SessionCalendar.find({});

    if (!sessionCalendar) {
      res.status(400);
      throw new Error(
        "Something went wrong while getting the Session Calendar."
      );
    }

    res.status(200).json({
      message: "Session Calendar fetched successfully.",
      data: sessionCalendar,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get a session calendar
// @route   GET /api/session/
// @access  Public
const getSession = asyncHandler(async (req, res) => {
  try {
    const sessionCalendar = await SessionCalendar.findById(req.params.id);

    if (!sessionCalendar) {
      res.status(400);
      throw new Error(
        "Something went wrong while getting the Session Calendar."
      );
    }

    res.status(200).json({
      message: "Session Calendar fetched successfully.",
      data: sessionCalendar,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Update a session calendar
// @route   PUT /api/session/
// @access  Admin
const updateSession = asyncHandler(async (req, res) => {
  try {
    let data = req.body;

    // check if session calendar exists
    const sessionExists = await SessionCalendar.findById(req.params.id);
    if (sessionExists) {
      res.status(400);
      throw new Error("No session calendar exists for the id");
    }

    data.marathi = JSON.parse(data.marathi);
    data.english = JSON.parse(data.english);

    let { document } = req.files;

    // add document to the data
    for (let i = 0; i < data.length; i++) {
      data[i].document = document[i];
    }

    // validate the data
    const { error } = updateSessionCalendarValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // create session calendar
    const sessionCalendar = await SessionCalendar.findByIdAndUpdate(
      req.params.id,
      data,
      {
        runValidators: true,
        new: true,
      }
    );

    if (!sessionCalendar) {
      res.status(400);
      throw new Error(
        "Something went wrong while creating the Session Calendar."
      );
    }

    await notificationGenerator(
      "Session Calendar",
      "Session Calendar updated!",
      res
    );

    res.status(201).json({
      message: "Session Calendar created updated.",
      data: sessionCalendar,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Delete a session calendar
// @route   DELETE /api/session/
// @access  Admin
const deleteSession = asyncHandler(async (req, res) => {
  try {
    const sessionCalendar = await SessionCalendar.findByIdAndDelete(
      req.params.id
    );

    if (!sessionCalendar) {
      res.status(400);
      throw new Error(
        "Something went wrong while getting the Session Calendar."
      );
    }

    res.status(200).json({
      message: "Session Calendar deleted successfully.",
      data: sessionCalendar,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

module.exports = {
  createSession,
  getAllSession,
  getSession,
  updateSession,
  deleteSession,
};
