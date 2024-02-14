const asyncHandler = require("express-async-handler");

const Minister = require("../../models/portals/Minister");
const {
  createMinisterValidation,
  updateMinisterValidation,
} = require("../../validations/portal/ministerValidation");

// @desc    Create a ministers
// @route   /api/minister/
// @access  Admin
const createMinister = asyncHandler(async (req, res) => {
  try {
    let data = req.body;

    // validate the data
    const { error } = createMinisterValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error);
    }
    console.log(data);

    // check if chief minister exists
    if (data.ministry_type === "Chief Minister") {
      const checkMinister = await Minister.find({
        ministry_type: "Chief Minister",
      });

      if (checkMinister?.length > 1) {
        res.status(400);
        throw new Error("Chief Minister already exists");
      }
    }

    // check if two Deputy Chief Minister exists
    if (data.ministry_type === "Deputy Chief Minister") {
      const checkMinister = await Minister.find({
        ministry_type: "Deputy Chief Minister",
      });

      if (checkMinister?.length > 2) {
        res.status(400);
        throw new Error("Already two Deputy Chief Minister entry exists");
      }
    }

    // create minister
    const minister = await Minister.create(data);

    if (!minister) {
      res.status(400);
      throw new Error("Something went wrong while creating the Minister.");
    }

    // let notificationData = {
    //   name: "Minister",
    //   marathi: {
    //     message: "नवी minister जोडले!",
    //   },
    //   english: {
    //     message: "New Minister added!",
    //   },
    // };

    // await createNotificationFormat(notificationData, res);

    res.status(201).json({
      message: "Minister created successfully.",
      data: minister,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("server error: " + error);
  }
});

// @desc    Get all ministers
// @route   /api/minister/
// @access  Admin
const getMinister = asyncHandler(async (req, res) => {
  try {
    const ministers = await Minister.find();

    if (!ministers) {
      res.status(400);
      throw new Error("Something went wrong while getting the ministers.");
    }

    res.status(200).json({
      message: "Ministers fetched successfully.",
      data: ministers,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("server error: " + error);
  }
});

// @desc    Get a ministers
// @route   /api/minister/:id
// @access  Admin
const getAMinister = asyncHandler(async (req, res) => {
  try {
    console.log(req.params.id);
    const minister = await Minister.findById(req.params.id);

    if (!minister) {
      res.status(400);
      throw new Error("Something went wrong while getting the minister.");
    }

    res.status(200).json({
      message: "Minister fetched successfully.",
      data: minister,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("server error: " + error);
  }
});

// @desc    Update a ministers
// @route   /api/minister/:id
// @access  Admin
const updateMinister = asyncHandler(async (req, res) => {
  try {
    let data = req.body;

    // check if ministry exists
    const existMinister = await Minister.findById(req.params.id);
    if (!existMinister) {
      res.status(400);
      throw new Error("No ministry exists for provided id");
    }

    // validate the data
    const { error } = updateMinisterValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message, error);
    }

    // check if chief minister exists
    if (data.ministry_type === "Chief Minister") {
      const checkMinister = await Minister.find({
        ministry_type: "Chief Minister",
      });

      if (checkMinister.length > 1) {
        res.status(400);
        throw new Error("Chief Minister already exists");
      }
    }

    // check if two Deputy Chief Minister exists
    if (data.ministry_type === "Deputy Chief Minister") {
      const checkMinister = await Minister.find({
        ministry_type: "Deputy Chief Minister",
      });

      if (checkMinister.length > 2) {
        res.status(400);
        throw new Error("Already two Deputy Chief Minister entry exists");
      }
    }

    // create minister
    const minister = await Minister.findByIdAndUpdate(req.params.id, data, {
      runValidators: true,
      new: true,
    });

    if (!minister) {
      res.status(400);
      throw new Error("Something went wrong while updating the Minister.");
    }

    // let notificationData = {
    //   name: "Minister",
    //   marathi: {
    //     message: "नवी minister जोडले!",
    //   },
    //   english: {
    //     message: "New Minister added!",
    //   },
    // };

    // await createNotificationFormat(notificationData, res);

    res.status(200).json({
      message: "Minister updated successfully.",
      data: minister,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("server error: " + error);
  }
});

// @desc    Delete a ministers
// @route   /api/minister/:id
// @access  Admin
const deleteMinister = asyncHandler(async (req, res) => {
  try {
    const minister = await Minister.findByIdAndDelete(req.params.id);

    if (!minister) {
      res.status(400);
      throw new Error("Something went wrong while getting the minister.");
    }

    res.status(204).json({
      message: "Minister deleted successfully.",
      data: {},
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("server error: " + error);
  }
});

module.exports = {
  createMinister,
  getMinister,
  getAMinister,
  updateMinister,
  deleteMinister,
};
