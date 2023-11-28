const asyncHandler = require("express-async-handler");

const VidhanParishad = require("../models/vidhanParishad");
const {
  createVidhanParishadValidation,
  updateVidhanParishadValidation,
} = require("../validations/parishadValidation");

// @desc    Create a vidhanParishad ==> /api/vidhanParishad/
const createVidhanParishad = asyncHandler(async (req, res) => {
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
    const { error } = createVidhanParishadValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message, error);
    }

    console.log("working");

    // create vidhanParishad
    const vidhanParishad = await VidhanParishad.create(data);

    if (!vidhanParishad) {
      res.status(400);
      throw new Error(
        "Something went wrong while creating the VidhanParishad."
      );
    }

    res.status(201).json({
      message: "VidhanParishad created successfully.",
      data: vidhanParishad,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message, error);
  }
});

// @desc    Get all vidhanParishads ==> /api/vidhanParishad/
const getVidhanParishads = asyncHandler(async (req, res) => {
  try {
    const vidhanParishads = await VidhanParishad.find();

    if (!vidhanParishads) {
      res.status(400);
      throw new Error(
        "Something went wrong while getting the VidhanParishads."
      );
    }

    res.status(200).json({
      message: "VidhanParishads fetched successfully.",
      data: vidhanParishads,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message, error);
  }
});

// @desc    Get vidhanParishad by id ==> /api/vidhanParishad/:id
const getVidhanParishadById = asyncHandler(async (req, res) => {
  try {
    const vidhanParishad = await VidhanParishad.findById(req.params.id);

    if (!vidhanParishad) {
      res.status(400);
      throw new Error("Something went wrong while getting the VidhanParishad.");
    }

    res.status(200).json({
      message: "VidhanParishad fetched successfully.",
      data: vidhanParishad,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message, error);
  }
});

// @desc    Update a vidhanParishad ==> /api/vidhanParishad/:id
const updateVidhanParishad = asyncHandler(async (req, res) => {
  try {
    let id = req.params.id;
    let data = req.body;

    // check if vidhanParishad exists
    const vidhanParishadExists = await VidhanParishad.findById(id);
    if (!vidhanParishadExists) {
      res.status(400);
      throw new Error("VidhanParishad not found.");
    }

    data.marathi = JSON.parse(data.marathi);
    data.english = JSON.parse(data.english);
    data.files = JSON.parse(data.files);

    let { banner_image, legislative_profile } = req.files;

    // if files available then update files
    if (banner_image) {
      data.banner_image = banner_image[0];
    } else {
      data.banner_image = vidhanParishadExists.banner_image;
    }

    if (legislative_profile) {
      // add all legislative profiles in req.body.legislative_council
      let countImg = 0;
      let legislative_council = [];
      for (
        let i = 0;
        i < vidhanParishadExists.legislative_council.length;
        i++
      ) {
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
      data.legislative_council = vidhanParishadExists.legislative_council;
    }
    // console.log(req.files);
    // console.log(data.legislative_council);

    // validate data & files
    // const { error } = updateVidhanParishadValidation(data);
    // if (error) {
    //   res.status(400);
    //   console.log(error);
    //   throw new Error(error.details[0].message, error);
    // }

    // update vidhanParishad
    const vidhanParishad = await VidhanParishad.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!vidhanParishad) {
      res.status(400);
      throw new Error(
        "Something went wrong while updating the VidhanParishad."
      );
    }

    res.status(200).json({
      message: "VidhanParishad updated successfully.",
      data: vidhanParishad,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message, error);
  }
});

// @desc    Delete a vidhanParishad ==> /api/vidhanParishad/:id
const deleteVidhanParishad = asyncHandler(async (req, res) => {
  try {
    const vidhanParishad = await VidhanParishad.findByIdAndDelete(
      req.params.id
    );

    if (!vidhanParishad) {
      res.status(400);
      throw new Error(
        "Something went wrong while deleting the VidhanParishad."
      );
    }

    res.status(200).json({
      message: "VidhanParishad deleted successfully.",
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message, error);
  }
});

module.exports = {
  getVidhanParishads,
  getVidhanParishadById,
  createVidhanParishad,
  updateVidhanParishad,
  deleteVidhanParishad,
};
