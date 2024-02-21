const asyncHandler = require("express-async-handler");

const VidhanParishad = require("../../models/portals/vidhanParishad");
const User = require("../../models/portals/userModel");

const {
  createVidhanParishadValidation,
  updateVidhanParishadValidation,
} = require("../../validations/portal/parishadValidation");

const {
  createNotificationFormat,
} = require("../../controllers/extras/notification.controllers");
const { createPending } = require("../reports/pending.controllers");

// @desc    Create a vidhanParishad
// @route   POST /api/parishad
// @access  Admin
const createVidhanParishad = asyncHandler(async (req, res) => {
  try {
    let data = req.body.data;
    let userId = res.locals.userInfo;
    let {
      banner_image,
      profile,
      legislative_profile,
      publication_docs_en,
      publication_docs_mr,
    } = req.files;

    data = JSON.parse(data);

    // add images to the file
    data.banner_image = banner_image[0];
    data.structure_profile = profile[0];

    // add all legislative profiles in req.body.legislative_council
    data.legislative_council.forEach((element, index) => {
      element.council_profile = legislative_profile[index];
    });

    // add all publication docs
    data.publication.forEach((element, index) => {
      element.english.document = publication_docs_en[index];
      element.marathi.document = publication_docs_mr[index];
    });

    // check if user exists and then add it
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }
    data.createdBy = userId.id;

    // validate data & files
    const { error } = createVidhanParishadValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message, error);
    }

    // create vidhanParishad
    const vidhanParishad = await VidhanParishad.create(data);
    if (!vidhanParishad) {
      res.status(400);
      throw new Error("Failed to create VidhanParishad.");
    }

    // notify others
    // let notificationData = {
    //   name: "VidhanParishad",
    //   marathi: {
    //     message: "नवी विधानपरिषद जोडले!",
    //   },
    //   english: {
    //     message: "New VidhanParishad added!",
    //   },
    // };
    // await createNotificationFormat(notificationData, res);

    // create a pending req to accept
    let pendingData = {
      modelId: vidhanParishad._id,
      modelName: "VidhanParishad",
      action: "Create",
    };
    let notificationMsg = {
      name: `${checkUser.full_name} wants to create VidhanParishad`,
      marathi: { message: "!" },
      english: { message: "!" },
    };
    await createPending(pendingData, notificationMsg, res);

    res.status(201).json({
      message: "VidhanParishad create request forwaded!",
      data: vidhanParishad,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get all vidhanParishads
// @route   GET /api/parishad
// @access  Public
const getVidhanParishads = asyncHandler(async (req, res) => {
  try {
    let { perPage, perLimit, ...id } = req.query;

    const pageOptions = {
      page: parseInt(perPage, 10) || 0,
      limit: parseInt(perLimit, 10) || 10,
    };

    const vidhanParishads = await VidhanParishad.find(id)
      .limit(pageOptions.limit)
      .skip(pageOptions.page * pageOptions.limit)
      .exec();

    if (!vidhanParishads) {
      res.status(400);
      throw new Error("No VidhanParishads found.");
    }

    res.status(200).json({
      message: "VidhanParishads fetched successfully.",
      data: vidhanParishads,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get active data
// @route   GET /api/parishad/active
// @access  Public
const getActiveVidhanParishad = asyncHandler(async (req, res) => {
  try {
    const getActive = await VidhanParishad.findOne({ isActive: true }).exec();
    if (!getActive) {
      res.status(400);
      throw new Error("No active data found.");
    }
    res.status(200).json({
      message: "Vidhan Parishad fetched successfully.",
      success: true,
      data: getActive,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get vidhanParishad by id
// @route   GET /api/parishad/:id
// @access  Public
const getVidhanParishadById = asyncHandler(async (req, res) => {
  try {
    const vidhanParishad = await VidhanParishad.findById(req.params.id);

    if (!vidhanParishad) {
      res.status(400);
      throw new Error("Something went wrong while getting the VidhanParishad.");
    }

    res.status(200).json({
      message: "VidhanParishad fetched successfully.",
      success: true,
      data: vidhanParishad,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Update a vidhanParishad
// @route   PUT /api/parishad/:id
// @access  Admin
const updateVidhanParishad = asyncHandler(async (req, res) => {
  try {
    let data = req.body.data;
    let userId = res.locals.userInfo;
    let id = req.params.id;
    let {
      banner_image,
      profile,
      legislative_profile,
      publication_docs_en,
      publication_docs_mr,
    } = req.files;

    data = JSON.parse(data);

    // check if vidhanParishad exists
    const vidhanParishadExists = await VidhanParishad.findById(id);
    if (!vidhanParishadExists) {
      res.status(400);
      throw new Error("VidhanParishad not found.");
    }

    // if new banner_image available, then update files
    if (banner_image) {
      data.banner_image = banner_image[0];
    }

    // if new profile available, then update files
    if (profile) {
      data.structure_profile = profile[0];
    }

    // check if user exists and add
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }
    data.updatedBy = userId.id;

    // if new legislative profiles exists, add all files to it's specified position
    let countImg = 0;
    if (legislative_profile && legislative_profile.length > 0) {
      data.legislative_council.forEach((element) => {
        element.council_profile =
          Object.keys(element.council_profile).length > 0
            ? element.council_profile
            : legislative_profile[countImg++];
      });
    }

    // if new publication docs exists, add all files to it's specified position
    let countDocEn = 0,
      countDocMr = 0;
    if (
      (publication_docs_en && publication_docs_en.length > 0) ||
      (publication_docs_mr && publication_docs_mr.length > 0)
    ) {
      data.publication.forEach((element) => {
        element.english.document =
          Object.keys(element.english.document).length > 0
            ? element.english.document
            : publication_docs_en[countDocEn++];
        element.marathi.document =
          Object.keys(element.marathi.document).length > 0
            ? element.marathi.document
            : publication_docs_mr[countDocMr++];
      });
    }

    // validate data & files
    const { error } = updateVidhanParishadValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message, error);
    }

    // // notify others
    // let notificationData = {
    //   name: "VidhanParishad",
    //   marathi: {
    //     message: "विधानपरिषद अपडेट झाले!",
    //   },
    //   english: {
    //     message: "VidhanParishad updated!",
    //   },
    // };
    // await createNotificationFormat(notificationData, res);

    // create a pending req to accept
    let pendingData = {
      modelId: vidhanParishadExists._id,
      modelName: "VidhanParishad",
      action: "Update",
      data_object: data,
    };
    let notificationMsg = {
      name: `${checkUser.full_name} wants to update VidhanParishad`,
      marathi: { message: "!" },
      english: { message: "!" },
    };
    await createPending(pendingData, notificationMsg, res);

    res.status(200).json({
      message: "VidhanParishad update request forwaded!",
      success: true,
      data: vidhanParishadExists,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Delete a vidhanParishad
// @route   DELETE /api/parishad/:id
// @access  Admin
const deleteVidhanParishad = asyncHandler(async (req, res) => {
  try {
    let userId = res.locals.userInfo;

    // check if user exists
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }

    //  check if parishad exists
    const vidhanParishad = await VidhanParishad.findById(req.params.id);
    if (!vidhanParishad) {
      res.status(400);
      throw new Error("No VidhanParishad found.");
    }

    // create a pending req to accept
    let pendingData = {
      modelId: vidhanParishad._id,
      modelName: "VidhanParishad",
      action: "Delete",
    };
    let notificationMsg = {
      name: `${checkUser.full_name} wants to delete VidhanParishad`,
      marathi: { message: "!" },
      english: { message: "!" },
    };
    await createPending(pendingData, notificationMsg, res);

    res.status(204).json({
      success: true,
      message: "VidhanParishad deleted successfully.",
      data: {},
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

module.exports = {
  getVidhanParishads,
  getActiveVidhanParishad,
  getVidhanParishadById,
  createVidhanParishad,
  updateVidhanParishad,
  deleteVidhanParishad,
};
