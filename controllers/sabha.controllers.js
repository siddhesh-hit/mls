const asyncHandler = require("express-async-handler");

const VidhanSabha = require("../models/vidhanSabha");
const {
  createVidhanSabhaValidation,
  updateVidhanSabhaValidation,
} = require("../validations/sabhaValidation");

const notificationGenerator = require("../utils/notification");

// @desc    Create a vidhanSabha
// @route   POST /api/sabha
// @access  Admin
const createVidhanSabha = asyncHandler(async (req, res) => {
  try {
    let data = req.body.data;
    data = JSON.parse(data);

    // console.log(req.files);

    let {
      banner_image,
      profile,
      legislative_profile,
      publication_docs_en,
      publication_docs_mr,
    } = req.files;

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

    await notificationGenerator(
      "VidhanSabha",
      "नवी विधानसभा जोडले!",
      "New VidhanSabha added!",
      res
    );

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
    const vidhanSabhas = await VidhanSabha.find();

    if (!vidhanSabhas) {
      res.status(400);
      throw new Error("Something went wrong while getting the vidhanSabhas.");
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
    res.status(201).json({
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

    data = JSON.parse(data);

    // check if vidhanSabha exists
    const vidhanSabhaExists = await VidhanSabha.findById(id);
    if (!vidhanSabhaExists) {
      res.status(400);
      throw new Error("VidhanSabha not found.");
    }

    let {
      banner_image,
      profile,
      legislative_profile,
      publication_docs_en,
      publication_docs_mr,
    } = req.files;

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

    // update vidhanSabha
    const vidhanSabha = await VidhanSabha.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!vidhanSabha) {
      res.status(400);
      throw new Error("Something went wrong while updating the vidhanSabha.");
    }

    await notificationGenerator(
      "VidhanSabha",
      "विधानसभा अपडेट झाले!",
      "VidhanSabha updated!",
      res
    );

    res.status(200).json({
      message: "VidhanSabha updated successfully.",
      success: true,
      data: vidhanSabha,
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
    const vidhanSabha = await VidhanSabha.findByIdAndDelete(req.params.id);

    if (!vidhanSabha) {
      res.status(400);
      throw new Error("Something went wrong while deleting the vidhanSabha.");
    }

    res.status(200).json({
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
