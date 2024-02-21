const asyncHandler = require("express-async-handler");

const VidhanMandal = require("../../models/portals/vidhanMandal");
const User = require("../../models/portals/userModel");

const {
  createVidhanMandalValidation,
  updateVidhanMandalValidation,
} = require("../../validations/portal/mandalValidation");

const {
  createNotificationFormat,
} = require("../../controllers/extras/notification.controllers");
const { createPending } = require("../reports/pending.controllers");

// @desc    Create a vidhan mandal
// @route   POST /api/mandal/
// @access  Admin
const createVidhanMandal = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    let userId = res.locals.userInfo;
    let { about_us_img, about_us_doc } = req.files;

    data.marathi = JSON.parse(data.marathi);
    data.english = JSON.parse(data.english);

    // check if files are empty
    if (
      !about_us_img ||
      !about_us_doc ||
      about_us_img.length !== about_us_doc.length
    ) {
      res.status(400);
      throw new Error("Invalid files provided");
    }

    // check if user exists and then add it
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }
    data.createdBy = userId.id;

    // add files in data
    let object_image = [];
    for (let i = 0; i < about_us_img.length; i++) {
      object_image.push({
        image: about_us_img[i],
        documents: about_us_doc[i],
      });
    }
    data.mandal_image = object_image;

    // validate data & files
    const { error } = createVidhanMandalValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message, error);
    }

    // create vidhan mandal
    const vidhanMandal = await VidhanMandal.create(data);
    if (!vidhanMandal) {
      res.status(400);
      throw new Error("Something went wrong while creating the Vidhan Mandal.");
    }

    // notify others
    // let notificationData = {
    //   name: "VidhanMandal",
    //   marathi: {
    //     message: "नवीन विधानमंडळ जोडले!",
    //   },
    //   english: {
    //     message: "New VidhanMandal added!",
    //   },
    // };
    // await createNotificationFormat(notificationData, res);

    // create a pending req to accept
    let pendingData = {
      modelId: vidhanMandal._id,
      modelName: "VidhanMandal",
      action: "Create",
    };
    let notificationMsg = {
      name: `${checkUser.full_name} wants to create VidhanMandal`,
      marathi: { message: "!" },
      english: { message: "!" },
    };
    await createPending(pendingData, notificationMsg, res);

    res.status(201).json({
      message: "Vidhan Mandal create request forwaded!.",
      data: vidhanMandal,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get all vidhan mandals
// @route   GET /api/mandal/
// @access  Public
const getVidhanMandals = asyncHandler(async (req, res) => {
  try {
    let { perPage, perLimit, ...id } = req.query;

    const pageOptions = {
      page: parseInt(perPage, 10) || 0,
      limit: parseInt(perLimit, 10) || 10,
    };

    const vidhanMandals = await VidhanMandal.find(id)
      .limit(pageOptions.limit)
      .skip(pageOptions.page * pageOptions.limit)
      .exec();

    if (!vidhanMandals) {
      res.status(404);
      throw new Error("No Vidhan Mandal found");
    }

    res.status(200).json({
      message: "Vidhan Mandal fetched successfully.",
      data: vidhanMandals,
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
const getActiveVidhanMandal = asyncHandler(async (req, res) => {
  try {
    const getActive = await VidhanMandal.findOne({ isActive: true }).exec();
    if (!getActive) {
      res.status(400);
      throw new Error("No active data found.");
    }
    res.status(200).json({
      message: "Vidhan Mandal fetched successfully.",
      data: getActive,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get a vidhan mandal by id
// @route   GET /api/mandal/:id
// @access  Public
const getVidhanMandalById = asyncHandler(async (req, res) => {
  try {
    // const data = req.params;
    // console.log(data);
    const vidhanMandal = await VidhanMandal.findById(req.params.id);

    if (!vidhanMandal) {
      res.status(404);
      throw new Error("No Vidhan Mandal found");
    }

    res.status(200).json({
      message: "Vidhan Mandal fetched successfully.",
      data: vidhanMandal,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Update a vidhan mandal by id
// @route   PUT /api/mandal/:id
// @access  Admin
const updateVidhanMandal = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    let userId = res.locals.userInfo;
    let { about_us_img, about_us_doc } = req.files;

    data.marathi = JSON.parse(data.marathi);
    data.english = JSON.parse(data.english);
    data.files = data.files ? JSON.parse(data.files) : data.files;

    // check if vidhan mandal exists
    const vidhanMandal = await VidhanMandal.findById(req.params.id);
    if (!vidhanMandal) {
      res.status(404);
      throw new Error("No Vidhan Mandal found");
    }

    // check if user exists and add
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }
    data.updatedBy = userId.id;

    // add files in data
    let countImg = 0;
    let countDoc = 0;
    let object_image = [];
    for (let i = 0; i < data.files.length; i++) {
      const fileData = data.files[i];
      object_image.push({
        image:
          fileData.image !== undefined &&
          Object.keys(fileData.image).length !== 0
            ? fileData.image
            : about_us_img[countImg++],
        documents:
          fileData.documents !== undefined &&
          Object.keys(fileData.documents).length !== 0
            ? fileData.documents
            : about_us_doc[countDoc++],
      });
    }
    data.mandal_image = object_image;

    // notify others
    // let notificationData = {
    //   name: "VidhanMandal",
    //   marathi: {
    //     message: "विधानमंडळ अपडेट झाले!",
    //   },
    //   english: {
    //     message: "VidhanMandal updated!",
    //   },
    // };
    // await createNotificationFormat(notificationData, res);

    // create a pending req to accept
    let pendingData = {
      modelId: vidhanMandal._id,
      modelName: "VidhanMandal",
      action: "Update",
      data_object: data,
    };
    let notificationMsg = {
      name: `${checkUser.full_name} wants to update VidhanMandal`,
      marathi: { message: "!" },
      english: { message: "!" },
    };
    await createPending(pendingData, notificationMsg, res);

    // send response
    res.status(200).json({
      message: "Vidhan Mandal update request forwaded!",
      data: vidhanMandal,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Delete a vidhan mandal by id
// @route   DELETE /api/mandal/:id
// @access  Admin
const deleteVidhanMandal = asyncHandler(async (req, res) => {
  try {
    let userId = res.locals.userInfo;

    // check if user exists
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }

    // check if vidhan mandal exists
    const vidhanMandal = await VidhanMandal.findById(req.params.id);
    if (!vidhanMandal) {
      res.status(404);
      throw new Error("No Vidhan Mandal found");
    }

    // create a pending req to accept
    let pendingData = {
      modelId: vidhanMandal._id,
      modelName: "VidhanMandal",
      action: "Delete",
    };
    let notificationMsg = {
      name: `${checkUser.full_name} wants to delete VidhanMandal`,
      marathi: { message: "!" },
      english: { message: "!" },
    };
    await createPending(pendingData, notificationMsg, res);

    res.status(204).json({
      message: "Vidhan Mandal delete request forwaded!",
      data: {},
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

module.exports = {
  getVidhanMandals,
  getActiveVidhanMandal,
  getVidhanMandalById,
  createVidhanMandal,
  updateVidhanMandal,
  deleteVidhanMandal,
};
