const asyncHandler = require("express-async-handler");

const Library = require("../../models/portals/library");
const User = require("../../models/portals/userModel");

const {
  createLibraryValidation,
  updateLibraryValidation,
} = require("../../validations/portal/libraryValidation");

const {
  createNotificationFormat,
} = require("../extras/notification.controllers");
const { createPending } = require("../reports/pending.controllers");

// @desc    Create new library
// @route   POST /api/library/
// @access  Admin
const createLibrary = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    let userId = res.locals.userInfo;
    let { banner } = req.files;

    data.english = JSON.parse(data.english);
    data.marathi = JSON.parse(data.marathi);

    // check if file is available
    if (!banner) {
      res.status(400);
      throw new Error("Please upload a file");
    }

    // add the image to the data
    data.banner = banner[0];
    data.createdBy = userId.id;

    // validate request body
    const { error } = createLibraryValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // check if user exists and then add it
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }

    // create new library
    const library = await Library.create(data);
    if (!library) {
      res.status(400);
      throw new Error("Invalid library data");
    }

    // notify others
    // let notificationData = {
    //   name: "Library",
    //   marathi: {
    //     message: "नवीन Library जोडले!",
    //   },
    //   english: {
    //     message: "New Library added!",
    //   },
    // };
    // await createNotificationFormat(notificationData, res);

    // create a pending req to accept
    let pendingData = {
      modelId: library._id,
      modelName: "Library",
      action: "Create",
    };
    let notificationMsg = {
      name: `${checkUser.full_name} wants to create Library`,
      marathi: { message: "!" },
      english: { message: "!" },
    };
    await createPending(pendingData, notificationMsg, res);

    // send response
    res.status(201).json({
      message: "Library create request forwaded!",
      data: library,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get all libraries
// @route   GET /api/library/
// @access  Public
const getLibraries = asyncHandler(async (req, res) => {
  try {
    let { perPage, perLimit, ...id } = req.query;

    const pageOptions = {
      limit: parseInt(perPage, 10) || 0,
      skip: parseInt(perLimit, 10) || 10,
    };

    // find library
    const libraries = await Library.find(id)
      .limit(pageOptions.limit)
      .skip(pageOptions.skip * pageOptions.limit)
      .exec();

    if (!libraries) {
      res.status(404);
      throw new Error("No libraries found");
    }

    res.status(200).json({
      message: "Libraries fetched successfully",
      data: libraries,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get active data
// @route   GET /api/mandal/active
// @access  Public
const getActiveLibrary = asyncHandler(async (req, res) => {
  try {
    const getActive = await Library.findOne({ isActive: true }).exec();
    if (!getActive) {
      res.status(400);
      throw new Error("No active data found.");
    }
    res.status(200).json({
      message: "Library fetched successfully.",
      data: getActive,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get single library
// @route   GET /api/library/:id
// @access  Public
const getLibrary = asyncHandler(async (req, res) => {
  try {
    // find and check
    const library = await Library.findById(req.params.id);
    if (!library) {
      res.status(404);
      throw new Error("No library found");
    }

    res.status(200).json({
      message: "Library fetched successfully",
      data: library,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Update library
// @route   PUT /api/library/:id
// @access  Admin
const updateLibrary = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    let userId = res.locals.userInfo;
    let { banner } = req.files;

    data.english = JSON.parse(data.english);
    data.marathi = JSON.parse(data.marathi);
    data.file = JSON.parse(data.file);

    // check if user exists and then add it
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }
    data.updatedBy = userId.id;

    // check if the library exists
    const libraryExists = await Library.findById(req.params.id);
    if (!libraryExists) {
      res.status(404);
      throw new Error("No library found");
    }

    // check if file is available and add it to the data
    if (banner && Object.keys(data.file).length === 0) {
      data.banner = banner[0];
    } else {
      data.banner = libraryExists.banner;
    }
    delete data.file;

    // validate request body
    const { error } = updateLibraryValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // notify others
    // let notificationData = {
    //   name: "Library",
    //   marathi: {
    //     message: "Library अपडेट झाले!",
    //   },
    //   english: {
    //     message: "Library Updated!",
    //   },
    // };
    // await createNotificationFormat(notificationData, res);

    // create a pending req to accept
    let pendingData = {
      modelId: libraryExists._id,
      modelName: "Library",
      action: "Update",
      data_object: data,
    };
    let notificationMsg = {
      name: `${checkUser.full_name} wants to update Library`,
      marathi: { message: "!" },
      english: { message: "!" },
    };
    await createPending(pendingData, notificationMsg, res);

    res.status(200).json({
      message: "Library update request forwaded!",
      data: libraryExists,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Delete library
// @route   DELETE /api/library/:id
// @access  Admin
const deleteLibrary = asyncHandler(async (req, res) => {
  try {
    let id = req.params.id;
    let userId = res.locals.userInfo;

    // check if user exists
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }

    // check if the library exists
    const libraryExists = await Library.findById(id);
    if (!libraryExists) {
      res.status(404);
      throw new Error("No library found");
    }

    // create a pending req to accept
    let pendingData = {
      modelId: libraryExists._id,
      modelName: "Library",
      action: "Delete",
    };
    let notificationMsg = {
      name: `${checkUser.full_name} wants to delete Library`,
      marathi: { message: "!" },
      english: { message: "!" },
    };
    await createPending(pendingData, notificationMsg, res);

    res.status(204).json({
      message: "Library deleted request forwaded!",
      data: {},
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

module.exports = {
  getLibraries,
  getLibrary,
  getActiveLibrary,
  createLibrary,
  updateLibrary,
  deleteLibrary,
};
