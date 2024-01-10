const asyncHandler = require("express-async-handler");

const Helpdesk = require("../../models/portals/helpDeskSchema");

const {
  createHelpDeskValidation,
  updateHelpDeskValidation,
} = require("../../validations/portal/helpdeskValidation");

// @desc    Create a helpdesk
// @route   POST /api/helpdesk/
// @access  Public
const createHelpdesk = asyncHandler(async (req, res) => {
  try {
    let data = req.body;

    // validate the data
    const { error } = createHelpDeskValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // create a helpdesk
    const helpdesk = await Helpdesk.create(data);
    if (!helpdesk) {
      res.status(400);
      throw new Error("Failed to create a helpdesk");
    } else {
      res.status(201).json({
        success: true,
        data: helpdesk,
        message: "helpdesk created successfully.",
      });
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get all helpdesk
// @route   POST /api/helpdesk/
// @access  Public
const getAllHelpdesk = asyncHandler(async (req, res) => {
  try {
    const helpdesk = await Helpdesk.find({});

    // check if helpdesk exists
    if (!helpdesk) {
      res.status(400);
      throw new Error("No helpdesk found");
    } else {
      res.status(201).json({
        success: true,
        message: "helpdesk fetched successfully.",
        data: helpdesk,
      });
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get a helpdesk
// @route   POST /api/helpdesk/:id
// @access  Public
const getHelpdesk = asyncHandler(async (req, res) => {
  try {
    const helpdesk = await Helpdesk.findById(req.params.id);

    // check if helpdesk exists
    if (!helpdesk) {
      res.status(400);
      throw new Error("No helpdesk found");
    } else {
      res.status(201).json({
        success: true,
        message: "helpdesk fetched successfully.",
        data: helpdesk,
      });
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Update a helpdesk
// @route   PUT /api/helpdesk/:id
// @access  Public
const updateHelpdesk = asyncHandler(async (req, res) => {
  try {
    let data = req.body;

    // validate the data
    const { error } = updateHelpDeskValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // find and update
    const helpdesk = await Helpdesk.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });

    // check if helpdesk exists
    if (!helpdesk) {
      res.status(400);
      throw new Error("No helpdesk found");
    } else {
      res.status(201).json({
        success: true,
        message: "helpdesk fetched successfully.",
        data: helpdesk,
      });
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Delete a helpdesk
// @route   DELETE /api/helpdesk/:id
// @access  Public
const deleteHelpdesk = asyncHandler(async (req, res) => {
  try {
    const helpdesk = await Helpdesk.findByIdAndDelete(req.params.id);

    // check if helpdesk exists
    if (!helpdesk) {
      res.status(400);
      throw new Error("No helpdesk found");
    } else {
      res.status(201).json({
        success: true,
        message: "helpdesk deleted successfully.",
        data: helpdesk,
      });
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

module.exports = {
  createHelpdesk,
  getAllHelpdesk,
  getHelpdesk,
  updateHelpdesk,
  deleteHelpdesk,
};
