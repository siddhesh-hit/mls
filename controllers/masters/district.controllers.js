const asyncHandler = require("express-async-handler");

const District = require("../../models/masters/district");

const {
  createDistrictValidation,
  updateDistrictValidation,
} = require("../../validations/master/districtValidation");

// @desc    Create a District
// @route   /api/v1/district/
// @access  Admin
const createDistrict = asyncHandler(async (req, res) => {
  try {
    let data = req.body;

    // validate the data
    const { error } = createDistrictValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // create district
    const district = await District.create(data);
    if (!district) {
      res.status(403);
      throw new Error("Couldn't create District.");
    }
    res.status(201).json({
      message: "District created successfully.",
      data: district,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get all District
// @route   GET /api/district/
// @access  Public
const getAllDistrict = asyncHandler(async (req, res) => {
  try {
    let { perPage, perLimit, ...id } = req.query;

    const pageOptions = {
      page: parseInt(perPage, 10) || 0,
      limit: parseInt(perLimit, 10) || 10,
    };

    // filter the query
    let matchedQuery = {};

    for (key in id) {
      if (id[key] !== "") {
        id[key] = id[key].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        matchedQuery[key] = new RegExp(`.*${id[key]}.*`, "i");
      }
    }

    console.log(matchedQuery);
    // aggregate on the query and send res
    const district = await District.aggregate([
      {
        $match: matchedQuery,
      },
      {
        $facet: {
          dis: [
            { $skip: pageOptions.page * pageOptions.limit },
            { $limit: pageOptions.limit },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);
    if (!district) {
      res.status(403);
      throw new Error("Couldn't find District.");
    }
    res.status(200).json({
      message: "District fetched successfully.",
      success: true,
      data: district[0]?.dis || [],
      count: district[0]?.totalCount[0]?.count || 0,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get a District
// @route   GET /api/district/:id
// @access  Public
const getDistrict = asyncHandler(async (req, res) => {
  try {
    // find district
    const district = await District.findById(req.params.id);
    if (!district) {
      res.status(403);
      throw new Error("Couldn't find District.");
    }
    res.status(200).json({
      message: "District fetched successfully.",
      data: district,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Update a District
// @route   PUT /api/district/:id
// @access  Admin
const updateDistrict = asyncHandler(async (req, res) => {
  try {
    let data = req.body;

    console.log(data);

    // validate the data
    const { error } = updateDistrictValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // create district
    const district = await District.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!district) {
      res.status(403);
      throw new Error("Couldn't find District.");
    }
    res.status(200).json({
      message: "District updated successfully.",
      data: district,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Delete a District
// @route   DELETE /api/district/:id
// @access  Admin
const deleteDistrict = asyncHandler(async (req, res) => {
  try {
    // find district & delete
    const district = await District.findByIdAndDelete(req.params.id);
    if (!district) {
      res.status(403);
      throw new Error("Couldn't find District.");
    }
    res.status(204).json({
      message: "District deleted successfully.",
      data: {},
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

module.exports = {
  createDistrict,
  getAllDistrict,
  getDistrict,
  updateDistrict,
  deleteDistrict,
};
