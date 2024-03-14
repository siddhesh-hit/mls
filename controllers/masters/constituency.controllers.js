const asyncHandler = require("express-async-handler");

const Constituency = require("../../models/masters/constituency");

const {
  createConstituencyValidation,
  updateConstituencyValidation,
} = require("../../validations/master/constituencyValidation");

// @desc    Create a Constituency
// @route   /api/v1/constituency/
// @access  Admin
const createConstituency = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    console.log(data);

    // validate the data
    // const { error } = createConstituencyValidation(data);
    // if (error) {
    //   res.status(400);
    //   throw new Error(error.details[0].message);
    // }

    // // create constituency
    // let constituency = [];

    // for (let i = 0; i < data.length; i++) {
    //   constituency.push(createdConstituency);
    // }

    if (data.isHouse === "Constituency") {
      data.assembly.assembly_number = null;
    }

    const createdConstituency = await Constituency.create(data);
    if (!createConstituency) {
      res.status(403);
      throw new Error("Couldn't create Constituency.");
    }
    res.status(201).json({
      message: "Constituency created successfully.",
      data: createdConstituency,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get all Constituency
// @route   GET /api/constituency/
// @access  Public
const getAllConstituency = asyncHandler(async (req, res) => {
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

    // aggregate on the query and send res
    const constituencies = await Constituency.aggregate([
      {
        $match: matchedQuery,
      },
      {
        $facet: {
          asse: [
            { $sort: { createdAt: -1 } },
            { $skip: pageOptions.page * pageOptions.limit },
            { $limit: pageOptions.limit },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    if (!constituencies) {
      res.status(403);
      throw new Error("Couldn't find Constituency.");
    }

    res.status(200).json({
      message: "Constituency fetched successfully.",
      success: true,
      data: constituencies[0]?.asse || [],
      count: constituencies[0]?.totalCount[0]?.count || 0,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get all master options
// @route   GET /api/constituency/option
// @access  Public
const getAllOption = asyncHandler(async (req, res) => {
  try {
    const options = await Constituency.find({}).select([
      "-isActive",
      "-status",
      "-createdBy",
      "-updatedBy",
      "-createdAt",
      "-updatedAt",
    ]);

    res.status(200).json({
      success: true,
      message: "All constituency fetched!",
      data: options,
    });
  } catch (error) {
    throw new Error("Server error : " + error);
  }
});

// @desc    Get a Constituency
// @route   GET /api/constituency/:id
// @access  Public
const getConstituency = asyncHandler(async (req, res) => {
  try {
    const constituency = await Constituency.findById(req.params.id);
    if (!constituency) {
      res.status(403);
      throw new Error("Couldn't find Constituency.");
    }
    res.status(200).json({
      message: "Constituency fetched successfully.",
      data: constituency,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Update a Constituency
// @route   PUT /api/constituency/:id
// @access  Admin
const updateConstituency = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    console.log(data);
    // validate the data
    const { error } = updateConstituencyValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // update constituency
    const constituency = await Constituency.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    );
    if (!constituency) {
      res.status(403);
      throw new Error("Couldn't create Constituency.");
    }
    res.status(200).json({
      message: "Constituency created successfully.",
      data: constituency,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Delete a Constituency
// @route   DELETE /api/constituency/:id
// @access  Admin
const deleteConstituency = asyncHandler(async (req, res) => {
  try {
    // find and delete
    const constituency = await Constituency.findByIdAndDelete(req.params.id);
    if (!constituency) {
      res.status(403);
      throw new Error("Couldn't find Constituency.");
    }
    res.status(204).json({
      message: "Constituency deleted successfully.",
      data: {},
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

module.exports = {
  createConstituency,
  getAllConstituency,
  getAllOption,
  getConstituency,
  updateConstituency,
  deleteConstituency,
};
