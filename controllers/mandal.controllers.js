const asyncHandler = require("express-async-handler");

const VidhanMandal = require("../models/vidhanMandal");

const {
  createVidhanMandalValidation,
  updateVidhanMandalValidation,
} = require("../validations/mandalValidation");

const notificationGenerator = require("../utils/notification");

// @desc    Create a vidhan mandal
// @route   POST /api/mandal/
// @access  Admin
const createVidhanMandal = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    data.marathi = JSON.parse(data.marathi);
    data.english = JSON.parse(data.english);

    // console.log(data);

    // console.log(req.files);

    let { about_us_img, about_us_doc } = req.files;

    // check if files are empty
    if (
      !about_us_img ||
      !about_us_doc ||
      about_us_img.length !== about_us_doc.length
    ) {
      res.status(400);
      throw new Error("Invalid files provided");
    }

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

    await notificationGenerator(
      "VidhanMandal",
      "नवीन विधानमंडळ जोडले!",
      "New VidhanMandal added!",
      res
    );

    res.status(201).json({
      message: "Vidhan Mandal created successfully.",
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
    const vidhanMandals = await VidhanMandal.find({});

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
    res.status(201).json({
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

    console.log(data);
    data.marathi = JSON.parse(data.marathi);
    data.english = JSON.parse(data.english);
    data.files = data.files ? JSON.parse(data.files) : data.files;

    console.log(data.english);
    console.log(data.marathi);

    // check if vidhan mandal exists
    const vidhanMandal = await VidhanMandal.findById(req.params.id);
    if (!vidhanMandal) {
      res.status(404);
      throw new Error("No Vidhan Mandal found");
    }

    let { about_us_img, about_us_doc } = req.files;

    // console.log(req.files);

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

    // console.log(object_image);

    data.mandal_image = object_image;

    // console.log(data);

    // validate data & files
    // const { error } = updateVidhanMandalValidation(data);
    // if (error) {
    //   res.status(400);
    //   throw new Error(error.details[0].message, error);
    // }

    // update vidhan mandal
    const updatedVidhanMandal = await VidhanMandal.findByIdAndUpdate(
      req.params.id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedVidhanMandal) {
      res.status(400);
      throw new Error("Something went wrong while updating the Vidhan Mandal.");
    }

    await notificationGenerator(
      "VidhanMandal",
      "विधानमंडळ अपडेट झाले!",
      "VidhanMandal updated!",
      res
    );

    res.status(200).json({
      message: "Vidhan Mandal updated successfully.",
      data: updatedVidhanMandal,
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
    const vidhanMandal = await VidhanMandal.findByIdAndDelete(req.params.id);

    if (!vidhanMandal) {
      res.status(404);
      throw new Error("No Vidhan Mandal found");
    }

    res.status(200).json({
      message: "Vidhan Mandal deleted successfully.",
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
