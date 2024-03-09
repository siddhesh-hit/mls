const asyncHandler = require("express-async-handler");

const Faq = require("../../models/portals/faqSchema");
const User = require("../../models/portals/userModel");

const {
  createFAQValidation,
  updateFAQValidation,
} = require("../../validations/portal/faqValidation");

const {
  createNotificationFormat,
} = require("../../controllers/extras/notification.controllers");
const { createPending } = require("../reports/pending.controllers");

// @desc    Create a new FAQ
// @route   POST /api/faq/
// @access  Admin
const createFAQ = asyncHandler(async (req, res) => {
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

    // check if data is present
    if (!data) {
      res.status(400);
      throw new Error("Please provide data");
    }

    // validate the data
    const { error } = createFAQValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // create a new FAQ
    const faq = await Faq.create(data);
    if (!faq) {
      res.status(400);
      throw new Error("Failed to create FAQ");
    }

    // // notify others
    // let notificationData = {
    //   name: "FAQ",
    //   marathi: {
    //     message: "नवीन FAQ जोडले!",
    //   },
    //   english: {
    //     message: "New FAQs added!",
    //   },
    // };
    // await createNotificationFormat(notificationData, res);

    // create a pending req to accept
    let pendingData = {
      modelId: faq._id,
      modelName: "Faq",
      action: "Create",
      data_object: faq,
    };
    let notificationMsg = {
      name: `${checkUser.full_name} wants to create FAQ`,
      marathi: { message: "!" },
      english: { message: "!" },
    };
    await createPending(pendingData, notificationMsg, res);

    // send response
    res.status(201).json({
      message: "FAQ create request forwaded!",
      data: faq,
      success: true,
    });
  } catch (error) {
    res.status(501);
    throw new Error(error);
  }
});

// @desc    Get all FAQs
// @route   GET /api/faq/
// @access  Public
const getAllFAQs = asyncHandler(async (req, res) => {
  try {
    let { perPage, perLimit, ...id } = req.query;

    const pageOptions = {
      page: parseInt(perPage, 10) || 0,
      limit: parseInt(perLimit, 10) || 10,
    };

    const faq = await Faq.find(id)
      .limit(pageOptions.limit)
      .skip(pageOptions.page * pageOptions.limit)
      .exec();

    // check if faq exists
    if (!faq) {
      res.status(404);
      throw new Error("No FAQs found");
    }

    // send response
    res.status(200).json({
      message: "FAQs fetched successfully",
      data: faq,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get active data
// @route   GET /api/faq/active
// @access  Public
const getActiveFaq = asyncHandler(async (req, res) => {
  try {
    const getActive = await Faq.find({ isActive: true }).exec();
    if (!getActive) {
      res.status(400);
      throw new Error("No active data found.");
    }
    res.status(200).json({
      message: "Faq fetched successfully.",
      data: getActive,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get a FAQ by ID
// @route   GET /api/faq/:id
// @access  Public
const getFAQById = asyncHandler(async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);

    // check if faq is present
    if (!faq) {
      res.status(404);
      throw new Error("FAQ not found");
    }

    // send response
    res.status(200).json({
      message: "FAQ fetched successfully",
      data: faq,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Update a FAQ by ID
// @route   PUT /api/faq/:id
// @access  Admin
const updateFAQById = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    let userId = res.locals.userInfo;

    // check if data is present
    if (!data) {
      res.status(400);
      throw new Error("Please provide data");
    }

    // validate the data
    const { error } = updateFAQValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // check if user exists and add
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }
    data.updatedBy = userId.id;

    // check if faq is present
    const faqExists = await Faq.findById(req.params.id);
    if (!faqExists) {
      res.status(404);
      throw new Error("FAQ not found");
    }

    // // notify others
    // let notificationData = {
    //   name: "FAQ",
    //   marathi: {
    //     message: "FAQs अपडेट झाले!",
    //   },
    //   english: {
    //     message: "FAQs Updated!",
    //   },
    // };
    // await createNotificationFormat(notificationData, res);

    // create a pending req to accept
    let pendingData = {
      modelId: faqExists._id,
      modelName: "Faq",
      action: "Update",
      data_object: data,
    };
    let notificationMsg = {
      name: `${checkUser.full_name} wants to update FAQ`,
      marathi: { message: "!" },
      english: { message: "!" },
    };
    await createPending(pendingData, notificationMsg, res);

    // send response
    res.status(200).json({
      message: "FAQ update request forwaded!",
      data: faqExists,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Delete a FAQ by ID
// @route   DELETE /api/faq/:id
// @access  Admin
const deleteFAQById = asyncHandler(async (req, res) => {
  try {
    let userId = res.locals.userInfo;

    // check if user exists
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }

    // check if faq is present
    const faqExists = await Faq.findById(req.params.id);
    if (!faqExists) {
      res.status(404);
      throw new Error("FAQ not found");
    }

    // create a pending req to accept
    let pendingData = {
      modelId: faqExists._id,
      modelName: "Faq",
      action: "Delete",
      data_object: faqExists,
    };
    let notificationMsg = {
      name: `${checkUser.full_name} wants to delete FAQ`,
      marathi: { message: "!" },
      english: { message: "!" },
    };
    await createPending(pendingData, notificationMsg, res);

    res.status(204).json({
      message: "FAQ deleted request forwaded!",
      data: {},
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

module.exports = {
  createFAQ,
  getActiveFaq,
  getAllFAQs,
  getFAQById,
  updateFAQById,
  deleteFAQById,
};
