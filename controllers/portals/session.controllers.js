const asyncHandler = require("express-async-handler");

const SessionCalendar = require("../../models/portals/sessionCalendar");
const {
  createSessionCalendarValidation,
  updateSessionCalendarValidation,
} = require("../../validations/portal/sessionValidation");

const {
  createNotificationFormat,
} = require("../../controllers/extras/notification.controllers");

// @desc    Create a session calendar
// @route   POST /api/session/
// @access  Admin
const createSession = asyncHandler(async (req, res) => {
  try {
    let data = req.body.data;

    data = JSON.parse(data);

    let { document } = req.files;

    // check if document exists
    if (!document) {
      res.status(400);
      throw new Error("Document is required!");
    }

    // add document to the data
    data.documents.forEach((ele, ind) => {
      ele.document = document[ind];
    });

    // validate the data
    const { error } = createSessionCalendarValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    console.log(data);

    // create session calendar
    const sessionCalendar = await SessionCalendar.create(data);

    if (!sessionCalendar) {
      res.status(400);
      throw new Error(
        "Something went wrong while creating the Session Calendar."
      );
    }

    let notificationData = {
      name: "Session Calendar",
      marathi: {
        message: "नवीन सत्र दिनदर्शिका जोडले!",
      },
      english: {
        message: "New Session Calendar added!",
      },
    };

    await createNotificationFormat(notificationData, res);

    res.status(201).json({
      message: "Session Calendar created successfully.",
      data: sessionCalendar,
      success: true,
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
      success: true,
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
      success: true,
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
    let data = req.body.data;

    // check if session calendar exists
    const sessionExists = await SessionCalendar.findById(req.params.id);
    if (!sessionExists) {
      res.status(400);
      throw new Error("No session calendar exists for the id");
    }

    data = JSON.parse(data);

    let { document } = req.files;

    // add document to the data
    let docCount = 0;
    data.documents.forEach((ele, ind) => {
      ele.document =
        Object.keys(ele.document).length > 0
          ? ele.document
          : document[docCount++];
    });

    // validate the data
    const { error } = updateSessionCalendarValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }
    console.log(data);

    // update session calendar
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

    let notificationData = {
      name: "Session Calendar",
      marathi: {
        message: "सत्र दिनदर्शिका अपडेट झाले!",
      },
      english: {
        message: "Session Calendar updated!",
      },
    };

    await createNotificationFormat(notificationData, res);

    res.status(200).json({
      message: "Session Calendar created updated.",
      data: sessionCalendar,
      success: true,
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

    res.status(204).json({
      message: "Session Calendar deleted successfully.",
      success: true,
      data: {},
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
