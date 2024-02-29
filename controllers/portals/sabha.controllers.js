const asyncHandler = require("express-async-handler");

const VidhanSabha = require("../../models/portals/vidhanSabha");
const User = require("../../models/portals/userModel");

const {
  createVidhanSabhaValidation,
  updateVidhanSabhaValidation,
} = require("../../validations/portal/sabhaValidation");

const {
  createNotificationFormat,
} = require("../../controllers/extras/notification.controllers");
const { createPending } = require("../reports/pending.controllers");

// @desc    Create a vidhanSabha
// @route   POST /api/sabha
// @access  Admin
const createVidhanSabha = asyncHandler(async (req, res) => {
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

    // add all legislative profiles in files
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
    const { error } = createVidhanSabhaValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message, error);
    }

    // create vidhanSabha
    const vidhanSabha = await VidhanSabha.create(data);
    if (!vidhanSabha) {
      res.status(400);
      throw new Error("Something went wrong while creating the vidhanSabha.");
    }

    // // notify others
    // let notificationData = {
    //   name: "VidhanSabha",
    //   marathi: {
    //     message: "नवी विधानसभा जोडले!",
    //   },
    //   english: {
    //     message: "New VidhanSabha added!",
    //   },
    // };
    // await createNotificationFormat(notificationData, res);

    // create a pending req to accept
    let pendingData = {
      modelId: vidhanSabha._id,
      modelName: "VidhanSabha",
      action: "Create",
      data_object: vidhanSabha,
    };
    let notificationMsg = {
      name: `${checkUser.full_name} wants to create VidhanSabha`,
      marathi: { message: "!" },
      english: { message: "!" },
    };
    await createPending(pendingData, notificationMsg, res);

    res.status(201).json({
      message: "VidhanSabha created successfully.",
      success: true,
      data: vidhanSabha,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get all vidhanSabhas
// @route   GET /api/sabha
// @access  Public
const getVidhanSabhas = asyncHandler(async (req, res) => {
  try {
    let { perPage, perLimit, ...id } = req.query;

    const pageOptions = {
      page: parseInt(perPage, 10) || 0,
      limit: parseInt(perLimit, 10) || 10,
    };

    const vidhanSabhas = await VidhanSabha.find(id)
      .limit(pageOptions.limit)
      .skip(pageOptions.page * pageOptions.limit)
      .exec();

    // check if sabha exists
    if (!vidhanSabhas) {
      res.status(400);
      throw new Error("No vidhanSabhas found.");
    }

    res.status(200).json({
      message: "VidhanSabhas fetched successfully.",
      success: true,
      data: vidhanSabhas,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get active data
// @route   GET /api/sabha/active
// @access  Public
const getActiveVidhanSabha = asyncHandler(async (req, res) => {
  try {
    const getActive = await VidhanSabha.findOne({ isActive: true }).exec();
    if (!getActive) {
      res.status(400);
      throw new Error("No active data found.");
    }
    res.status(200).json({
      message: "Vidhan Sabha fetched successfully.",
      success: true,
      data: getActive,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get single vidhanSabha by id
// @route   GET /api/sabha/:id
// @access  Public
const getVidhanSabhaById = asyncHandler(async (req, res) => {
  try {
    const vidhanSabha = await VidhanSabha.findById(req.params.id);

    if (!vidhanSabha) {
      res.status(400);
      throw new Error("Something went wrong while getting the vidhanSabha.");
    }

    res.status(200).json({
      message: "VidhanSabha fetched successfully.",
      success: true,
      data: vidhanSabha,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Update a vidhanSabha
// @route   PUT /api/sabha/:id
// @access  Admin
const updateVidhanSabha = asyncHandler(async (req, res) => {
  try {
    let id = req.params.id;
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

    // check if vidhanSabha exists
    const vidhanSabhaExists = await VidhanSabha.findById(id);
    if (!vidhanSabhaExists) {
      res.status(400);
      throw new Error("VidhanSabha not found.");
    }

    // check if user exists and add
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }
    data.updatedBy = userId.id;

    // if new banner_image available, then update files
    if (banner_image) {
      data.banner_image = banner_image[0];
    }

    // if new profile available, then update files
    if (profile) {
      data.structure_profile = profile[0];
    }

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
    const { error } = updateVidhanSabhaValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message, error);
    }

    // // notify others
    // let notificationData = {
    //   name: "VidhanSabha",
    //   marathi: {
    //     message: "विधानसभा अपडेट झाले!",
    //   },
    //   english: {
    //     message: "VidhanSabha updated!",
    //   },
    // };
    // await createNotificationFormat(notificationData, res);

    // create a pending req to accept
    let pendingData = {
      modelId: vidhanSabhaExists._id,
      modelName: "VidhanSabha",
      action: "Update",
      data_object: data,
    };
    let notificationMsg = {
      name: `${checkUser.full_name} wants to update VidhanSabha`,
      marathi: { message: "!" },
      english: { message: "!" },
    };
    await createPending(pendingData, notificationMsg, res);

    res.status(200).json({
      message: "VidhanSabha updated successfully.",
      success: true,
      data: vidhanSabhaExists,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Delete a vidhanSabha
// @route   DELETE /api/sabha/:id
// @access  Admin
const deleteVidhanSabha = asyncHandler(async (req, res) => {
  try {
    let userId = res.locals.userInfo;

    // check if user exists
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }

    // check if sabha exists
    const vidhanSabha = await VidhanSabha.findById(req.params.id);
    if (!vidhanSabha) {
      res.status(400);
      throw new Error("No vidhanSabha found.");
    }

    // create a pending req to accept
    let pendingData = {
      modelId: vidhanSabha._id,
      modelName: "VidhanSabha",
      action: "Delete",
      data_object: vidhanSabha,
    };
    let notificationMsg = {
      name: `${checkUser.full_name} wants to delete VidhanSabha`,
      marathi: { message: "!" },
      english: { message: "!" },
    };
    await createPending(pendingData, notificationMsg, res);

    // send response
    res.status(204).json({
      success: true,
      message: "VidhanSabha deleted successfully.",
      data: {},
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

module.exports = {
  getVidhanSabhas,
  getActiveVidhanSabha,
  getVidhanSabhaById,
  createVidhanSabha,
  updateVidhanSabha,
  deleteVidhanSabha,
};
