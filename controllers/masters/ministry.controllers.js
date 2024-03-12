const asyncHandler = require("express-async-handler");

const Ministry = require("../../models/masters/Ministry");
const User = require("../../models/portals/userModel");

const {
  createMinistryValidation,
  updateMinistryValidation,
} = require("../../validations/master/ministryValidation");

// @desc    Create a Ministry
// @route   POST   /api/v1/ministry/
// @access  Admin
const createMinistry = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    let userId = res.locals.userInfo;

    // check if user exists and then add it
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }
    data.createdBy = userId.id;

    // validate the data
    const { error } = createMinistryValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // create a Ministry & send res
    let createministry = await Ministry.create(data);
    if (!createministry) {
      res.status(400);
      throw new Error("Failed to create a Ministry!");
    }

    res.status(201).json({
      success: true,
      message: "Created a Ministry!",
      data: createministry,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Internal error: " + error);
  }
});

// @desc    Create a Ministry
// @route   GET   /api/v1/ministry/
// @access  Admin
const getMinistries = asyncHandler(async (req, res) => {
  try {
    let { perPage, perLimit, ...id } = req.query;

    const pageOptions = {
      page: parseInt(perPage, 10) || 0,
      limit: parseInt(perLimit, 10) || 10,
    };

    // filter the query
    let matchedQuery = {};

    // aggregate on the query and send res
    let ministries = await Ministry.aggregate([
      {
        $match: matchedQuery,
      },
      {
        $facet: {
          ministry: [
            { $skip: pageOptions.page * pageOptions.limit },
            { $limit: pageOptions.limit },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    // // populate the document with ref
    // let populateMinistry = await Ministry.populate(ministries[0]?.ministry, {
    //   path: "designation",
    // });

    res.status(200).json({
      success: true,
      message: "Fetched all Ministry!",
      data: ministries[0]?.ministry || [],
      count: ministries[0]?.totalCount[0]?.count || 0,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Internal error: " + error);
  }
});

// @desc    Create a Ministry
// @route   GET   /api/v1/ministry/:id
// @access  Admin
const getMinistry = asyncHandler(async (req, res) => {
  try {
    // check if ministry exists
    let mini = await Ministry.findById(req.params.id);
    if (!mini) {
      res.status(400);
      throw new Error("No Ministry found for provided id!");
    }

    res.status(200).json({
      success: true,
      message: "Fetched Ministry for provided id!",
      data: mini,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Internal error: " + error);
  }
});

// @desc    Create a Ministry
// @route   PUT   /api/v1/ministry/:id
// @access  Admin
const updateMinistry = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    let userId = res.locals.userInfo;

    // check if user exists and then add it
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }
    data.updatedBy = userId.id;

    // validate the data
    const { error } = updateMinistryValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // update a Ministry & send res
    let updatemini = await Ministry.findByIdAndUpdate(req.params.id, data, {
      runValidators: true,
      new: true,
    });

    if (!updatemini) {
      res.status(400);
      throw new Error("Failed to update a Ministry!");
    }

    res.status(200).json({
      success: true,
      message: "Updated a Ministry!",
      data: updatemini,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Internal error: " + error);
  }
});

// @desc    Create a Ministry
// @route   DELETE   /api/v1/ministry/:id
// @access  Admin
const deleteMinistry = asyncHandler(async (req, res) => {
  try {
    // check if dep exists
    let minExists = await Ministry.findById(req.params.id);
    if (!minExists) {
      res.status(400);
      throw new Error("No Ministry found for provided id!");
    }

    let minDel = await Ministry.findByIdAndDelete(req.params.id);
    if (!minDel) {
      res.status(400);
      throw new Error("Failed to delete Ministry!");
    }

    res.status(204).json({
      success: true,
      message: "Deleted Ministry for provided id!",
      data: {},
    });
  } catch (error) {
    res.status(500);
    throw new Error("Internal error: " + error);
  }
});

module.exports = {
  createMinistry,
  getMinistries,
  getMinistry,
  updateMinistry,
  deleteMinistry,
};
