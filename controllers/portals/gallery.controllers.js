const asyncHandler = require("express-async-handler");
const joi = require("joi");

const MandalGallery = require("../../models/portals/mandalGallery");

const imageValidate = (data) => {
  const schema = joi.object({
    gallery_image: joi
      .array()
      .items(
        joi.object({
          fieldname: joi.string().required(),
          originalname: joi.string().required(),
          encoding: joi.string().required(),
          mimetype: joi.string().required(),
          destination: joi.string().required(),
          filename: joi.string().required(),
          path: joi.string().required(),
          size: joi.number().required(),
        })
      )
      .required(),
  });
  return schema.validate(data);
};

// @desc    Create a mandal gallery
// @route   POST /api/gallery/
// @access  Admin
const createMandalGallery = asyncHandler(async (req, res) => {
  try {
    let files = req.files;

    console.log(files);

    // check if file is present
    if (!files) {
      res.status(400);
      throw new Error("Please upload a file");
    }

    // check validation
    const { error } = imageValidate(files);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // create mandal gallery
    let galleries = [];

    for (let i = 0; i < files.gallery_image.length; i++) {
      const gallery = await MandalGallery.create(files.gallery_image[i]);
      if (!gallery) {
        res.status(400);
        throw new Error("Failed to create Vidhan Mandal gallery");
      }
      galleries.push(gallery);
    }

    // send response
    res.status(201).json({
      message: "Vidhan Mandal gallery created successfully.",
      data: galleries,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get all mandal galleries
// @route   GET /api/gallery/
// @access  Public
const getAllMandalGalleries = asyncHandler(async (req, res) => {
  try {
    const gallery = await MandalGallery.find();

    // check if gallery is present
    if (!gallery) {
      res.status(404);
      throw new Error("No Vidhan Mandal images found");
    }

    // send response
    res.status(200).json({
      message: "Vidhan Mandal gallery fetched successfully.",
      data: gallery,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get a mandal gallery by id
// @route   GET /api/gallery/:id
// @access  Public
const getMandalGalleryById = asyncHandler(async (req, res) => {
  try {
    const gallery = await MandalGallery.findById(req.params.id);

    // check if gallery is present
    if (!gallery) {
      res.status(404);
      throw new Error("No Vidhan Mandal images found");
    }

    // send response
    res.status(200).json({
      message: "Vidhan Mandal gallery fetched successfully.",
      data: gallery,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Update a mandal gallery by id
// @route   PUT /api/gallery/:id
// @access  Admin
const updateMandalGallery = asyncHandler(async (req, res) => {
  try {
    let file = req.files;

    // check if file is present
    if (!file) {
      res.status(400);
      throw new Error("Please upload a file");
    }

    // check if gallery is present
    const galleryExists = await MandalGallery.findById(req.params.id);
    if (!galleryExists) {
      res.status(404);
      throw new Error("No Vidhan Mandal images found");
    }

    console.log(galleryExists, "gall");

    console.log(file);
    // // check validation
    // const { error } = imageValidate(req.file);
    // if (error) {
    //   res.status(400);
    //   throw new Error(error.details[0].message);
    // }

    // create mandal gallery
    const gallery = await MandalGallery.findByIdAndUpdate(
      req.params.id,
      file.gallery_image ? file.gallery_image[0] : file.gallery_image,
      {
        new: true,
        runValidators: true,
      }
    );

    // check if gallery is present
    if (!gallery) {
      res.status(400);
      throw new Error("Failed to update Vidhan Mandal gallery");
    }

    // send response
    res.status(201).json({
      message: "Vidhan Mandal gallery updated successfully.",
      data: gallery,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Delete a mandal gallery by id
// @route   DELETE /api/gallery/:id
// @access  Admin
const deleteMandalGallery = asyncHandler(async (req, res) => {
  try {
    // check if gallery is present
    const gallery = await MandalGallery.findByIdAndDelete(req.params.id);

    // check if gallery is present
    if (!gallery) {
      res.status(404);
      throw new Error("No Vidhan Mandal images found");
    }

    // send response
    res.status(200).json({
      message: "Vidhan Mandal gallery deleted successfully.",
      data: {},
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

module.exports = {
  getAllMandalGalleries,
  getMandalGalleryById,
  createMandalGallery,
  updateMandalGallery,
  deleteMandalGallery,
};
