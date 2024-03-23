const asyncHandler = require("express-async-handler");

const Minister = require("../../models/portals/Minister");
const User = require("../../models/portals/userModel");

const {
  createMinisterValidation,
  updateMinisterValidation,
} = require("../../validations/portal/ministerValidation");
const { createPending } = require("../reports/pending.controllers");

// @desc    Create a ministers
// @route   /api/v1/minister/
// @access  Admin
const createMinister = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    let userId = res.locals.userInfo;

    // check if user exists and then add it
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }
    data.createdBy = userId.id;

    // // validate the data
    // const { error } = createMinisterValidation(data);
    // if (error) {
    //   res.status(400);
    //   throw new Error(error);
    // }

    // check if chief minister exists
    // if (data.ministry_type === "Chief Minister") {
    //   const checkMinister = await Minister.find({
    //     ministry_type: "Chief Minister",
    //   });

    //   if (checkMinister?.length > 1) {
    //     res.status(400);
    //     throw new Error("Chief Minister already exists");
    //   }
    // }

    // // check if two Deputy Chief Minister exists
    // if (data.ministry_type === "Deputy Chief Minister") {
    //   const checkMinister = await Minister.find({
    //     ministry_type: "Deputy Chief Minister",
    //   });

    //   if (checkMinister?.length > 2) {
    //     res.status(400);
    //     throw new Error("Already two Deputy Chief Minister entry exists");
    //   }
    // }

    // create minister
    const minister = await Minister.create(data);
    if (!minister) {
      res.status(400);
      throw new Error("Failed to create minister.");
    }

    // notify others
    // let notificationData = {
    //   name: "Minister",
    //   marathi: {
    //     message: "नवी minister जोडले!",
    //   },
    //   english: {
    //     message: "New Minister added!",
    //   },
    // };
    // await createNotificationFormat(notificationData, res);

    // create a pending req to accept
    let pendingData = {
      modelId: minister._id,
      modelName: "Minister",
      action: "Create",
      data_object: minister,
    };
    let notificationMsg = {
      name: `${checkUser.full_name} wants to create Minister`,
      marathi: { message: "!" },
      english: { message: "!" },
    };
    await createPending(pendingData, notificationMsg, res);

    res.status(201).json({
      message: "Minister create request forwaded.",
      data: minister,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("server error: " + error);
  }
});

// @desc    Get all ministers
// @route   /api/v1/minister/
// @access  Admin
const getMinister = asyncHandler(async (req, res) => {
  try {
    let { perPage, perLimit, ...id } = req.query;

    const pageOptions = {
      page: parseInt(perPage, 10) || 0,
      limit: parseInt(perLimit, 10) || 10,
    };

    const ministers = await Minister.find(id)
      .limit(pageOptions.limit)
      .skip(pageOptions.page * pageOptions.limit)
      .exec();

    // check if any present
    if (!ministers) {
      res.status(400);
      throw new Error("No ministers found.");
    }

    res.status(200).json({
      message: "Ministers fetched successfully.",
      data: ministers,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("server error: " + error);
  }
});

// @desc    Get a ministers
// @route   /api/v1/minister/:id
// @access  Admin
const getAMinister = asyncHandler(async (req, res) => {
  try {
    const minister = await Minister.findById(req.params.id).populate([
      "assembly_number",
      "member_name",
      "designation",
      "ministry_type",
      "presiding",
      "legislative_position",
    ]);
    if (!minister) {
      res.status(400);
      throw new Error("No minister found.");
    }

    res.status(200).json({
      message: "Minister fetched successfully.",
      data: minister,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("server error: " + error);
  }
});

// @desc    Update a ministers
// @route   /api/v1/minister/:id
// @access  Admin
const updateMinister = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    let userId = res.locals.userInfo;

    // check if ministry exists
    const existMinister = await Minister.findById(req.params.id);
    if (!existMinister) {
      res.status(400);
      throw new Error("No ministry exists for provided id");
    }

    // check if user exists and add
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }
    data.updatedBy = userId.id;

    // // validate the data
    // const { error } = updateMinisterValidation(data);
    // if (error) {
    //   res.status(400);
    //   throw new Error(error.details[0].message, error);
    // }

    // // check if chief minister exists
    // if (data.ministry_type === "Chief Minister") {
    //   const checkMinister = await Minister.find({
    //     ministry_type: "Chief Minister",
    //   });

    //   if (checkMinister.length > 1) {
    //     res.status(400);
    //     throw new Error("Chief Minister already exists");
    //   }
    // }

    // // check if two Deputy Chief Minister exists
    // if (data.ministry_type === "Deputy Chief Minister") {
    //   const checkMinister = await Minister.find({
    //     ministry_type: "Deputy Chief Minister",
    //   });

    //   if (checkMinister.length > 2) {
    //     res.status(400);
    //     throw new Error("Already two Deputy Chief Minister entry exists");
    //   }
    // }

    // notify others
    // let notificationData = {
    //   name: "Minister",
    //   marathi: {
    //     message: "नवी minister जोडले!",
    //   },
    //   english: {
    //     message: "New Minister added!",
    //   },
    // };
    // await createNotificationFormat(notificationData, res);

    // create a pending req to accept
    let pendingData = {
      modelId: existMinister._id,
      modelName: "Minister",
      action: "Update",
      data_object: data,
    };
    let notificationMsg = {
      name: `${checkUser.full_name} wants to update Minister`,
      marathi: { message: "!" },
      english: { message: "!" },
    };
    await createPending(pendingData, notificationMsg, res);

    res.status(200).json({
      message: "Minister update request forwaded!",
      data: existMinister,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("server error: " + error);
  }
});

// @desc    Delete a ministers
// @route   /api/v1/minister/:id
// @access  Admin
const deleteMinister = asyncHandler(async (req, res) => {
  try {
    let userId = res.locals.userInfo;

    // check if user exists
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }

    // check if minister exists
    const minister = await Minister.findById(req.params.id);
    if (!minister) {
      res.status(400);
      throw new Error("Something went wrong while getting the minister.");
    }

    // create a pending req to accept
    let pendingData = {
      modelId: minister._id,
      modelName: "Minister",
      action: "Delete",
      data_object: minister,
    };
    let notificationMsg = {
      name: `${checkUser.full_name} wants to delete Minister`,
      marathi: { message: "!" },
      english: { message: "!" },
    };
    await createPending(pendingData, notificationMsg, res);

    res.status(204).json({
      message: "Minister delete request forwaded!",
      data: {},
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("server error: " + error);
  }
});

module.exports = {
  createMinister,
  getMinister,
  getAMinister,
  updateMinister,
  deleteMinister,
};
