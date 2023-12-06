const asyncHandler = require("express-async-handler");
const Library = require("../models/library");

const {
  createLibraryValidation,
  updateLibraryValidation,
} = require("../validations/libraryValidation");

// @desc    Create new library
// @route   POST /api/library/
// @access  Admin
const createLibrary = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    let file = req.file;

    data.english = JSON.parse(data.english);
    data.marathi = JSON.parse(data.marathi);

    // check if file is available
    if (!file) {
      res.status(400);
      throw new Error("Please upload a file");
    }

    // add the image to the data
    data.banner = file;

    // console.log(data);

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
    let file = req.files;

    data.english = JSON.parse(data.english);
    data.marathi = JSON.parse(data.marathi);

    console.log(data);
    console.log(file);

    // check if the library exists
    const libraryExists = await Library.findById(req.params.id);
    if (!libraryExists) {
      res.status(404);
      throw new Error("No library found");
    }

    // check if file is available and add it to the data
    if (file) {
      data.banner = file;
    } else {
      data.banner = libraryExists.banner;
    }

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
  createLibrary,
  updateLibrary,
  deleteLibrary,
};
