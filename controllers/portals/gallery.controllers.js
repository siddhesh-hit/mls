const asyncHandler = require("express-async-handler");
const joi = require("joi");

const MandalGallery = require("../../models/portals/mandalGallery");
const User = require("../../models/portals/userModel");

const { createPending } = require("../reports/pending.controllers");

const imageValidate = (data) => {
  const schema = joi
    .object({
      fieldname: joi.string().required(),
      originalname: joi.string().required(),
      encoding: joi.string().required(),
      mimetype: joi.string().required(),
      destination: joi.string().required(),
      filename: joi.string().required(),
      path: joi.string().required(),
      size: joi.number().required(),
    })
    .optional();
  return schema.validate(data);
};

// @desc    Create a mandal gallery
// @route   POST /api/gallery/
// @access  Admin
const createMandalGallery = asyncHandler(async (req, res) => {
  try {
    let files = req.files.gallery_image[0];

    let userId = res.locals.userInfo;

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

    // check if user exists and add
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }

    // let galleries = [];
    // for (let i = 0; i < files.gallery_image.length; i++) {
    //   const gallery = await MandalGallery.create(files.gallery_image[i]);
    //   if (!gallery) {
    //     res.status(400);
    //     throw new Error("Failed to create Vidhan Mandal gallery");
    //   }
    //   galleries.push(gallery);
    // }

    files.createdBy = userId.id;

    // create mandal gallery
    const gallery = await MandalGallery.create(files);
    if (!gallery) {
      res.status(400);
      throw new Error("Failed to create Vidhan Mandal gallery");
    }

    // create a pending req to accept
    let pendingData = {
      modelId: gallery._id,
      modelName: "MandalGallery",
      action: "Create",
      data_object: gallery,
    };
    let notificationMsg = {
      name: `${checkUser.full_name} wants to create MandalGallery`,
      marathi: { message: "!" },
      english: { message: "!" },
    };
    await createPending(pendingData, notificationMsg, res);

    // send response
    res.status(201).json({
      message: "Mandal Gallery create request forwaded!",
      data: gallery,
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
    let { perPage, perLimit, ...id } = req.query;
    const pageOptions = {
      page: parseInt(perPage, 10) || 0,
      limit: parseInt(perLimit, 10) || 10,
    };

    const gallery = await MandalGallery.find(id)
      .limit(pageOptions.limit)
      .skip(pageOptions.limit * pageOptions.page)
      .exec();

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
    let userId = res.locals.userInfo;

    // check if user exists and add
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }

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

    // // check validation
    // const { error } = imageValidate(req.file);
    // if (error) {
    //   res.status(400);
    //   throw new Error(error.details[0].message);
    // }

    // create a pending req to accept

    file.gallery_image.createdBy = userId.id;

    let pendingData = {
      modelId: galleryExists._id,
      modelName: "MandalGallery",
      action: "Update",
      data_object: file,
    };
    let notificationMsg = {
      name: `${checkUser.full_name} wants to update MandalGallery`,
      marathi: { message: "!" },
      english: { message: "!" },
    };
    await createPending(pendingData, notificationMsg, res);

    // send response
    res.status(200).json({
      message: "Vidhan Mandal gallery update request forwaded!",
      data: galleryExists,
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
    let userId = res.locals.userInfo;

    // check if user exists and add
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }

    // check if gallery is present
    const galleryExists = await MandalGallery.findById(req.params.id);
    if (!galleryExists) {
      res.status(404);
      throw new Error("No Vidhan Mandal images found");
    }

    // create a pending req to accept
    let pendingData = {
      modelId: galleryExists._id,
      modelName: "MandalGallery",
      action: "Delete",
      data_object: galleryExists,
    };
    let notificationMsg = {
      name: `${checkUser.full_name} wants to delete MandalGallery`,
      marathi: { message: "!" },
      english: { message: "!" },
    };
    await createPending(pendingData, notificationMsg, res);

    // send response
    res.status(204).json({
      message: "Vidhan Mandal gallery delete request forwaded!",
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
