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
    let data = req.body;

    data.marathi = JSON.parse(data.marathi);
    data.english = JSON.parse(data.english);

    let { banner_image, legislative_profile } = req.files;

    data.banner_image = banner_image[0];

    // add all legislative profiles in req.body.legislative_council
    let legislative_council = [];
    for (let i = 0; i < legislative_profile.length; i++) {
      legislative_council.push({
        council_profile: legislative_profile[i],
      });
    }

    data.legislative_council = legislative_council;

    console.log(data);

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

    await notificationGenerator("VidhanSabha", "New VidhanSabha added!", res);

    res.status(201).json({
      message: "VidhanSabha created successfully.",
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
    let data = req.body;

    // console.log(data);

    // check if vidhanSabha exists
    const vidhanSabhaExists = await VidhanSabha.findById(id);
    if (!vidhanSabhaExists) {
      res.status(400);
      throw new Error("VidhanSabha not found.");
    }

    data.marathi = JSON.parse(data.marathi);
    data.english = JSON.parse(data.english);
    data.files = JSON.parse(data.files);

    let { banner_image, legislative_profile } = req.files;
    console.log(req.files);

    // if files available then update files
    if (banner_image) {
      data.banner_image = banner_image[0];
    } else {
      data.banner_image = vidhanSabhaExists.banner_image;
    }

    if (legislative_profile) {
      // add all legislative profiles in req.body.legislative_council
      let countImg = 0;
      let legislative_council = [];
      for (let i = 0; i < vidhanSabhaExists.legislative_council.length; i++) {
        legislative_council.push({
          council_profile:
            data.files[i].council_profile &&
            Object.keys(data.files[i].council_profile).length !== 0
              ? data.files[i].council_profile
              : legislative_profile[countImg++],
        });
      }
      data.legislative_council = legislative_council;
    } else {
      data.legislative_council = vidhanSabhaExists.legislative_council;
    }

    delete data.files;
    delete data.legislative_profile;

    // // validate data & files
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

    await notificationGenerator("VidhanSabha", "VidhanSabha updated!", res);

    res.status(200).json({
      message: "VidhanSabha updated successfully.",
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
      message: "VidhanSabha deleted successfully.",
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
