const asyncHandler = require("express-async-handler");

const Faq = require("../models/faqSchema");
const {
  createFAQValidation,
  updateFAQValidation,
} = require("../validations/faqValidation");

// @desc    Create a new FAQ
// @route   POST /api/faq/
// @access  Admin
const createFAQ = asyncHandler(async (req, res) => {
  try {
    let data = req.body;

    console.log(data);

    // check if data is present
    if (!data) {
      res.status(400);
      throw new Error("Please provide data");
    }

    // data.english = JSON.parse(data.english);
    // data.marathi = JSON.parse(data.marathi);

    // validate the data
    const { error } = createFAQValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // create a new FAQ
    const FAQs = [];

    for (let i = 0; i < data.length; i++) {
      const faq = await Faq.create(data[i]);
      if (!faq) {
        res.status(400);
        throw new Error("Failed to create FAQ");
      }
      FAQs.push(faq);
    }

    res.status(201).json({
      message: "FAQ created successfully",
      data: FAQs,
    });
  } catch (error) {
    res.status(501);
    throw new Error(error);
  }
});

// @desc    Get all FAQs
// @route   GET /api/faq/
// @access  Public
const getAllFAQs = asyncHandler(async (req, res) => {
  try {
    const faq = await Faq.find();

    // check if faq is present
    if (!faq) {
      res.status(404);
      throw new Error("No FAQs found");
    }

    // send response
    res.status(200).json({
      message: "FAQs fetched successfully",
      data: faq,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get active data
// @route   GET /api/faq/active
// @access  Public
const getActiveFaq = asyncHandler(async (req, res) => {
  try {
    const getActive = await Faq.find({ isActive: true }).exec();
    if (!getActive) {
      res.status(400);
      throw new Error("No active data found.");
    }
    res.status(201).json({
      message: "Faq fetched successfully.",
      data: getActive,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get a FAQ by ID
// @route   GET /api/faq/:id
// @access  Public
const getFAQById = asyncHandler(async (req, res) => {
  try {
    const faq = await Faq.findById(req.params.id);

    // check if faq is present
    if (!faq) {
      res.status(404);
      throw new Error("FAQ not found");
    }

    // send response
    res.status(200).json({
      message: "FAQ fetched successfully",
      data: faq,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Update a FAQ by ID
// @route   PUT /api/faq/:id
// @access  Admin
const updateFAQById = asyncHandler(async (req, res) => {
  try {
    let data = req.body;

    // check if data is present
    if (!data) {
      res.status(400);
      throw new Error("Please provide data");
    }

    // data.english = JSON.parse(data.english);
    // data.marathi = JSON.parse(data.marathi);

    // validate the data
    const { error } = updateFAQValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // check if faq is present
    const faqExists = await Faq.findById(req.params.id);
    if (!faqExists) {
      res.status(404);
      throw new Error("FAQ not found");
    }

    // update the faq
    const updatedFAQ = await Faq.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });

    // check and send response
    if (!updatedFAQ) {
      res.status(400);
      throw new Error("Something went wrong");
    } else {
      res.status(200).json({
        message: "FAQ updated successfully",
        data: updatedFAQ,
      });
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Delete a FAQ by ID
// @route   DELETE /api/faq/:id
// @access  Admin
const deleteFAQById = asyncHandler(async (req, res) => {
  try {
    // check if faq is present
    const faqExists = await Faq.findById(req.params.id);
    if (!faqExists) {
      res.status(404);
      throw new Error("FAQ not found");
    }

    // delete the faq
    const deletedFAQ = await Faq.findByIdAndDelete(req.params.id);

    // check and send response
    if (!deletedFAQ) {
      res.status(400);
      throw new Error("Something went wrong");
    } else {
      res.status(200).json({
        message: "FAQ deleted successfully",
        data: deletedFAQ,
      });
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

module.exports = {
  createFAQ,
  getActiveFaq,
  getAllFAQs,
  getFAQById,
  updateFAQById,
  deleteFAQById,
};
