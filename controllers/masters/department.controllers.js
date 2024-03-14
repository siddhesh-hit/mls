const asyncHandler = require("express-async-handler");

const Department = require("../../models/masters/Department");
const User = require("../../models/portals/userModel");

// @desc    Create a Department
// @route   POST   /api/v1/department/
// @access  Admin
const createDepartment = asyncHandler(async (req, res) => {
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

    // check if data exists
    if (!data.name || !data.year || !data.sub_dep || !data.designation) {
      res.status(400);
      throw new Error("Fill each data properly!");
    }

    // create a department & send res
    let createDep = await Department.create(data);
    if (!createDep) {
      res.status(400);
      throw new Error("Failed to create a department!");
    }

    res.status(201).json({
      success: true,
      message: "Created a department!",
      data: createDep,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Internal error: " + error);
  }
});

// @desc    Create a Department
// @route   GET   /api/v1/department/
// @access  Admin
const getDepartments = asyncHandler(async (req, res) => {
  try {
    let { perPage, perLimit, ...id } = req.query;

    const pageOptions = {
      page: parseInt(perPage, 10) || 0,
      limit: parseInt(perLimit, 10) || 10,
    };

    // filter the query
    let matchedQuery = {};

    // aggregate on the query and send res
    let departments = await Department.aggregate([
      {
        $match: matchedQuery,
      },
      {
        $facet: {
          dep: [
            { $skip: pageOptions.page * pageOptions.limit },
            { $limit: pageOptions.limit },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    // populate the document with ref
    let populateDepartment = await Department.populate(departments[0]?.dep, {
      path: "designation",
    });

    res.status(200).json({
      success: true,
      message: "Fetched all department!",
      data: populateDepartment || [],
      count: departments[0]?.totalCount[0]?.count || 0,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Internal error: " + error);
  }
});

// @desc    Get all master options
// @route   GET /api/department/option
// @access  Public
const getAllOption = asyncHandler(async (req, res) => {
  try {
    const options = await Department.find({}).select([
      "-isActive",
      "-status",
      "-createdBy",
      "-updatedBy",
      "-createdAt",
      "-updatedAt",
    ]);

    res.status(200).json({
      success: true,
      message: "All Department fetched!",
      data: options,
    });
  } catch (error) {
    throw new Error("Server error : " + error);
  }
});

// @desc    Create a Department
// @route   GET   /api/v1/department/:id
// @access  Admin
const getDepartment = asyncHandler(async (req, res) => {
  try {
    // check if dep exists
    let department = await Department.findById(req.params.id);
    if (!department) {
      res.status(400);
      throw new Error("No department found for provided id!");
    }

    res.status(200).json({
      success: true,
      message: "Fetched department for provided id!",
      data: department,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Internal error: " + error);
  }
});

// @desc    Create a Department
// @route   PUT   /api/v1/department/:id
// @access  Admin
const updateDepartment = asyncHandler(async (req, res) => {
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

    // check if data exists
    if (!data.name || !data.year || !data.sub_dep || !data.designation) {
      res.status(400);
      throw new Error("Fill each data properly!");
    }

    // update a department & send res
    let updateDep = await Department.findByIdAndUpdate(req.params.id, data, {
      runValidators: true,
      new: true,
    });

    if (!updateDep) {
      res.status(400);
      throw new Error("Failed to update a department!");
    }

    res.status(201).json({
      success: true,
      message: "Updated a department!",
      data: updateDep,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Internal error: " + error);
  }
});

// @desc    Create a Department
// @route   DELETE   /api/v1/department/:id
// @access  Admin
const deleteDepartment = asyncHandler(async (req, res) => {
  try {
    // check if dep exists
    let depExist = await Department.findById(req.params.id);
    if (!depExist) {
      res.status(400);
      throw new Error("No department found for provided id!");
    }

    let department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      res.status(400);
      throw new Error("Failed to delete department!");
    }

    res.status(204).json({
      success: true,
      message: "Deleted department for provided id!",
      data: {},
    });
  } catch (error) {
    res.status(500);
    throw new Error("Internal error: " + error);
  }
});

module.exports = {
  createDepartment,
  getDepartments,
  getAllOption,
  getDepartment,
  updateDepartment,
  deleteDepartment,
};
