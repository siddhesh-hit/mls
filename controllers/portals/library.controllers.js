const asyncHandler = require("express-async-handler");
const Library = require("../../models/portals/library");

const {
  createLibraryValidation,
  updateLibraryValidation,
} = require("../../validations/portal/libraryValidation");

// @desc    Create new library
// @route   POST /api/library/
// @access  Admin
const createLibrary = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    let { banner } = req.files;

    data.english = JSON.parse(data.english);
    data.marathi = JSON.parse(data.marathi);

    // check if file is available
    if (!banner) {
      res.status(400);
      throw new Error("Please upload a file");
    }

    // add the image to the data
    data.banner = banner[0];

    console.log(data);

    // validate request body
    const { error } = createLibraryValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // create new library
    const library = await Library.create(data);

    if (library) {
      res.status(201).json({
        message: "Library created successfully",
        data: library,
        success: true,
      });
    } else {
      res.status(400);
      throw new Error("Invalid library data");
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get all libraries
// @route   GET /api/library/
// @access  Public
const getLibraries = asyncHandler(async (req, res) => {
  try {
    const libraries = await Library.find({});
    if (libraries) {
      res.status(200).json({
        message: "Libraries fetched successfully",
        data: libraries,
        success: true,
      });
    } else {
      res.status(404);
      throw new Error("No libraries found");
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get active data
// @route   GET /api/mandal/active
// @access  Public
const getActiveLibrary = asyncHandler(async (req, res) => {
  try {
    const getActive = await Library.findOne({ isActive: true }).exec();
    if (!getActive) {
      res.status(400);
      throw new Error("No active data found.");
    }
    res.status(201).json({
      message: "Library fetched successfully.",
      data: getActive,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get single library
// @route   GET /api/library/:id
// @access  Public
const getLibrary = asyncHandler(async (req, res) => {
  try {
    const library = await Library.findById(req.params.id);
    if (library) {
      res.status(200).json({
        message: "Library fetched successfully",
        data: library,
        success: true,
      });
    } else {
      res.status(404);
      throw new Error("No library found");
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Update library
// @route   PUT /api/library/:id
// @access  Admin
const updateLibrary = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    // console.log(data);

    let { banner } = req.files;
    // console.log(req.files);

    data.english = JSON.parse(data.english);
    data.marathi = JSON.parse(data.marathi);
    data.file = JSON.parse(data.file);

    // check if the library exists
    const libraryExists = await Library.findById(req.params.id);
    if (!libraryExists) {
      res.status(404);
      throw new Error("No library found");
    }

    // check if file is available and add it to the data
    if (banner && Object.keys(data.file).length === 0) {
      data.banner = banner[0];
    } else {
      data.banner = libraryExists.banner;
    }

    // console.log(data);

    delete data.file;

    // validate request body
    const { error } = updateLibraryValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // update library
    const updatedLibrary = await Library.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    );
    if (updatedLibrary) {
      res.status(200).json({
        message: "Library updated successfully",
        data: updatedLibrary,
        success: true,
      });
    } else {
      res.status(400);
      throw new Error("Invalid library data");
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Delete library
// @route   DELETE /api/library/:id
// @access  Admin
const deleteLibrary = asyncHandler(async (req, res) => {
  try {
    let id = req.params.id;

    // check if the library exists
    const libraryExists = await Library.findById(id);
    if (!libraryExists) {
      res.status(404);
      throw new Error("No library found");
    }

    // delete library
    const deletedLibrary = await Library.findByIdAndDelete(id);

    if (deletedLibrary) {
      res.status(200).json({
        message: "Library deleted successfully",
        success: true,
        data: {},
      });
    } else {
      res.status(400);
      throw new Error("Invalid library data");
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

module.exports = {
  getLibraries,
  getLibrary,
  getActiveLibrary,
  createLibrary,
  updateLibrary,
  deleteLibrary,
};
