const asyncHandler = require("express-async-handler");

const MemberGraph = require("../models/memberGraph");
const {
  createMemberGraphSchema,
  updateMemberGraphSchema,
} = require("../validations/graphValidation");

// @desc    Create a memberGraph ==> /api/graph/
const createMemberGraph = asyncHandler(async (req, res) => {
  try {
    let data = req.body;

    // validate the data before creating a new memberGraph
    const { error } = createMemberGraphSchema(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // create a new memberGraph
    const memberGraph = await MemberGraph.create(data);
    if (!memberGraph) {
      res.status(400);
      throw new Error("Failed to create memberGraph");
    }

    res.status(201).json({
      message: "memberGraph created successfully.",
      data: memberGraph,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error" + error);
  }
});

// @desc    Get all memberGraphs ==> /api/graph/
const getAllMemberGraphs = asyncHandler(async (req, res) => {
  try {
    const memberGraphs = await MemberGraph.find({});
    // check if memberGraphs exist
    if (!memberGraphs) {
      res.status(400);
      throw new Error("No memberGraphs found");
    }

    res.status(200).json({
      message: "All memberGraphs fetched successfully.",
      data: memberGraphs,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error" + error);
  }
});

// @desc    Get a memberGraph by id ==> /api/graph/:id
const getMemberGraphById = asyncHandler(async (req, res) => {
  try {
    const memberGraph = await MemberGraph.findById(req.params.id);
    // check if memberGraph exist
    if (!memberGraph) {
      res.status(404);
      throw new Error("No memberGraph found");
    }

    res.status(200).json({
      message: "memberGraph fetched successfully.",
      data: memberGraph,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error" + error);
  }
});

// @desc    Update a memberGraph by id ==> /api/graph/:id
const updateMemberGraph = asyncHandler(async (req, res) => {
  try {
    let data = req.body;

    // validate the data before updating a memberGraph
    const { error } = updateMemberGraphSchema(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // check if memberGraph exist
    const memberGraphExist = await MemberGraph.findById(req.params.id);
    if (!memberGraphExist) {
      res.status(404);
      throw new Error("No memberGraph found");
    }

    // update a memberGraph
    const memberGraph = await MemberGraph.findByIdAndUpdate(
      req.params.id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!memberGraph) {
      res.status(400);
      throw new Error("Failed to update memberGraph");
    }

    res.status(201).json({
      message: "memberGraph updated successfully.",
      data: memberGraph,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error" + error);
  }
});

// @desc    Delete a memberGraph by id ==> /api/graph/:id
const deleteMemberGraph = asyncHandler(async (req, res) => {
  try {
    const memberGraph = await MemberGraph.findByIdAndDelete(req.params.id);
    // check if memberGraph exist
    if (!memberGraph) {
      res.status(404);
      throw new Error("No memberGraph found");
    }

    res.status(200).json({
      message: "memberGraph deleted successfully.",
      data: {},
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error" + error);
  }
});

module.exports = {
  getAllMemberGraphs,
  getMemberGraphById,
  createMemberGraph,
  updateMemberGraph,
  deleteMemberGraph,
};
