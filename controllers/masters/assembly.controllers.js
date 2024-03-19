const asyncHandler = require("express-async-handler");

const Assembly = require("../../models/masters/assembly");

const {
  createAssemblyValidation,
  updateAssemblyValidation,
} = require("../../validations/master/assemblyValidation");

// @desc    Create a assembly
// @route   /api/v1/assembly/
// @access  Admin
const createAssembly = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    console.log(data);
    // validate the data
    const { error } = createAssemblyValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // create assembly
    let assembly = [];

    for (let i = 0; i < data.length; i++) {
      const createdAssembly = await Assembly.create(data[i]);
      if (!createdAssembly) {
        res.status(403);
        throw new Error("Couldn't create assembly.");
      }
      assembly.push(createAssembly);
    }

    res.status(201).json({
      message: "Assembly created successfully.",
      data: assembly,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get all assembly
// @route   GET /api/assembly/
// @access  Public
const getAllAssembly = asyncHandler(async (req, res) => {
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
    let assemblies = await Assembly.aggregate([
      {
        $match: matchedQuery,
      },
      {
        $facet: {
          asse: [
            { $skip: pageOptions.page * pageOptions.limit },
            { $limit: pageOptions.limit },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    if (!assemblies) {
      res.status(400);
      throw new Error("No assembly found.");
    }

    res.status(200).json({
      message: "Assembly created successfully.",
      success: true,
      data: assemblies[0]?.asse || [],
      count: assemblies[0]?.totalCount[0]?.count || 0,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get all master options
// @route   GET /api/assembly/option
// @access  Public
const getAllOption = asyncHandler(async (req, res) => {
  try {
    const options = await Assembly.find({})
      .sort({ assembly_number: 1 })
      .select([
        "-isActive",
        "-status",
        "-createdBy",
        "-updatedBy",
        "-createdAt",
        "-updatedAt",
      ]);

    res.status(200).json({
      success: true,
      message: "All Assembly fetched!",
      data: options,
    });
  } catch (error) {
    throw new Error("Server error : " + error);
  }
});

// @desc    Get a assembly
// @route   GET /api/assembly/:id
// @access  Public
const getAssembly = asyncHandler(async (req, res) => {
  try {
    const assembly = await Assembly.findById(req.params.id);

    if (!assembly) {
      res.status(400);
      throw new Error("No assembly found.");
    }

    res.status(200).json({
      message: "Assembly created successfully.",
      data: assembly,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Update a assembly
// @route   PUT /api/assembly/:id
// @access  Admin
const updateAssembly = asyncHandler(async (req, res) => {
  try {
    let data = req.body;

    console.log(data);
    // validate the data
    const { error } = updateAssemblyValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // update assembly
    const assembly = await Assembly.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });
    if (!assembly) {
      res.status(404);
      throw new Error("No assembly found.");
    }
    res.status(200).json({
      message: "Assembly updated successfully.",
      data: assembly,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Delete a assembly
// @route   DELETE /api/assembly/:id
// @access  Admin
const deleteAssembly = asyncHandler(async (req, res) => {
  try {
    // find and delete
    const assembly = await Assembly.findByIdAndDelete(req.params.id);

    if (!assembly) {
      res.status(400);
      throw new Error("No assembly found.");
    }

    res.status(204).json({
      message: "Assembly deleted successfully.",
      data: {},
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

module.exports = {
  createAssembly,
  getAllAssembly,
  getAllOption,
  getAssembly,
  updateAssembly,
  deleteAssembly,
};
