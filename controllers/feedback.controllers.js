const asyncHandler = require("express-async-handler");

const Feedback = require("../models/feedback");

const {
  createFeedbackValidation,
  updateFeedbackValidation,
} = require("../validations/feedbackValidation");

const notificationGenerator = require("../utils/notification");

// @desc    Create a feedback
// @route   POST /api/feedback/
// @access  Public
const createFeedback = asyncHandler(async (req, res) => {
  try {
    let data = req.body;

    // validate the data
    const { error } = createFeedbackValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // create a feedback
    const feedback = await Feedback.create(data);
    if (!feedback) {
      res.status(400);
      throw new Error("Failed to create a feedback");
    } else {
      res.status(201).json({
        success: true,
        data: feedback,
        message: "Feedback created successfully.",
      });
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get all feedback
// @route   POST /api/feedback/
// @access  Public
const getAllFeedback = asyncHandler(async (req, res) => {
  try {
    const feedback = await Feedback.find({});

    // check if feedback exists
    if (!feedback) {
      res.status(400);
      throw new Error("No feedback found");
    } else {
      res.status(201).json({
        success: true,
        message: "Feedback fetched successfully.",
        data: feedback,
      });
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get a feedback
// @route   POST /api/feedback/:id
// @access  Public
const getFeedback = asyncHandler(async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    // check if feedback exists
    if (!feedback) {
      res.status(400);
      throw new Error("No feedback found");
    } else {
      res.status(201).json({
        success: true,
        message: "Feedback fetched successfully.",
        data: feedback,
      });
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Update a feedback
// @route   PUT /api/feedback/:id
// @access  Public
const updateFeedback = asyncHandler(async (req, res) => {
  try {
    let data = req.body;

    // validate the data
    const { error } = updateFeedbackValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // find and update
    const feedback = await Feedback.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });

    // check if feedback exists
    if (!feedback) {
      res.status(400);
      throw new Error("No feedback found");
    } else {
      res.status(201).json({
        success: true,
        message: "Feedback fetched successfully.",
        data: feedback,
      });
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Delete a feedback
// @route   DELETE /api/feedback/:id
// @access  Public
const deleteFeedback = asyncHandler(async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    // check if feedback exists
    if (!feedback) {
      res.status(400);
      throw new Error("No feedback found");
    } else {
      res.status(201).json({
        success: true,
        message: "Feedback deleted successfully.",
        data: feedback,
      });
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

module.exports = {
  createFeedback,
  getAllFeedback,
  getFeedback,
  updateFeedback,
  deleteFeedback,
};
