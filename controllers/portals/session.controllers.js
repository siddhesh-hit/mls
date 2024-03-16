const asyncHandler = require("express-async-handler");

const SessionCalendar = require("../../models/portals/sessionCalendar");
const User = require("../../models/portals/userModel");

const {
  createSessionCalendarValidation,
  updateSessionCalendarValidation,
} = require("../../validations/portal/sessionValidation");

const {
  createNotificationFormat,
} = require("../../controllers/extras/notification.controllers");
const { createPending } = require("../reports/pending.controllers");

// @desc    Create a session calendar
// @route   POST /api/session/
// @access  Admin
const createSession = asyncHandler(async (req, res) => {
  try {
    let data = req.body.data;
    let userId = res.locals.userInfo;
    let { document } = req.files;

    data = JSON.parse(data);

    // check if document exists
    if (!document) {
      res.status(400);
      throw new Error("Document is required!");
    }

    // check if user exists and then add it
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }
    data.createdBy = userId.id;

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

    // create session calendar
    const sessionCalendar = await SessionCalendar.create(data);
    if (!sessionCalendar) {
      res.status(400);
      throw new Error("Failed to create Session Calendar.");
    }

    // // notify others
    // let notificationData = {
    //   name: "Session Calendar",
    //   marathi: {
    //     message: "नवीन सत्र दिनदर्शिका जोडले!",
    //   },
    //   english: {
    //     message: "New Session Calendar added!",
    //   },
    // };
    // await createNotificationFormat(notificationData, res);

    // create a pending req to accept
    let pendingData = {
      modelId: sessionCalendar._id,
      modelName: "SessionCalendar",
      action: "Create",
      data_object: sessionCalendar,
    };
    let notificationMsg = {
      name: `${checkUser.full_name} wants to create SessionCalendar`,
      marathi: { message: "!" },
      english: { message: "!" },
    };
    await createPending(pendingData, notificationMsg, res);

    res.status(201).json({
      message: "Session Calendar create request forwaded!",
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
    let { perPage, perLimit, ...id } = req.query;

    const pageOptions = {
      page: parseInt(perPage, 10) || 0,
      limit: parseInt(perLimit, 10) || 10,
    };

    const newCheck = {};
    Object.keys(id).forEach((ele) => {
      if (id[ele]) {
        newCheck[ele] = id[ele];
      }
    });

    console.log(newCheck, "newCheck");

    const sessionCalendar = await SessionCalendar.find(newCheck)
      .populate("session")
      .limit(pageOptions.limit)
      .skip(pageOptions.page * pageOptions.limit)
      .exec();

    // check if SessionCalendar exists
    if (!sessionCalendar) {
      res.status(400);
      throw new Error("No Session Calendar found.");
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
// @route   GET /api/session/:id
// @access  Public
const getSession = asyncHandler(async (req, res) => {
  try {
    const sessionCalendar = await SessionCalendar.findById(
      req.params.id
    ).populate("session");

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
// @route   PUT /api/session/:id
// @access  Admin
const updateSession = asyncHandler(async (req, res) => {
  try {
    let data = req.body.data;
    let userId = res.locals.userInfo;
    let { document } = req.files;

    data = JSON.parse(data);

    // check if user exists and add
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }
    data.updatedBy = userId.id;

    // check if session calendar exists
    const sessionExists = await SessionCalendar.findById(req.params.id);
    if (!sessionExists) {
      res.status(400);
      throw new Error("No session calendar exists for the id");
    }

    // add document to the data
    let docCount = 0;
    data.documents.forEach((ele, ind) => {
      ele.document =
        Object.keys(ele.document).length > 0
          ? ele.document
          : document[docCount++];
    });

    console.log(data);

    // validate the data
    const { error } = updateSessionCalendarValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // // notify others
    // let notificationData = {
    //   name: "Session Calendar",
    //   marathi: {
    //     message: "सत्र दिनदर्शिका अपडेट झाले!",
    //   },
    //   english: {
    //     message: "Session Calendar updated!",
    //   },
    // };
    // await createNotificationFormat(notificationData, res);

    // create a pending req to accept
    let pendingData = {
      modelId: sessionExists._id,
      modelName: "SessionCalendar",
      action: "Update",
      data_object: data,
    };
    let notificationMsg = {
      name: `${checkUser.full_name} wants to update SessionCalendar`,
      marathi: { message: "!" },
      english: { message: "!" },
    };
    await createPending(pendingData, notificationMsg, res);

    res.status(200).json({
      message: "Session Calendar update request forwaded!",
      data: sessionExists,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Delete a session calendar
// @route   DELETE /api/session/:id
// @access  Admin
const deleteSession = asyncHandler(async (req, res) => {
  try {
    let userId = res.locals.userInfo;

    // check if user exists
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }

    const sessionCalendar = await SessionCalendar.findById(req.params.id);
    if (!sessionCalendar) {
      res.status(400);
      throw new Error("no Session Calendar found.");
    }

    // create a pending req to accept
    let pendingData = {
      modelId: sessionCalendar._id,
      modelName: "SessionCalendar",
      action: "Delete",
      data_object: sessionCalendar,
    };
    let notificationMsg = {
      name: `${checkUser.full_name} wants to delete SessionCalendar`,
      marathi: { message: "!" },
      english: { message: "!" },
    };
    await createPending(pendingData, notificationMsg, res);

    res.status(204).json({
      message: "Session Calendar delete request forwaded!",
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get all options a session calendar
// @route   GET /api/session/option
// @access  Public
const getSessionFilterOptions = asyncHandler(async (req, res) => {
  try {
    const id = req.query.id;
    let filterOptions = await SessionCalendar.find().distinct(id);
    if (!filterOptions) {
      res.status(400);
      throw new Error("No filter options found.");
    }
    res.status(200).json({
      message: "Filter options fetched successfully.",
      data: filterOptions,
      success: true,
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
  getSessionFilterOptions,
};
