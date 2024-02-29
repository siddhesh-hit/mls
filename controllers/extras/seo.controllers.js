const asyncHandler = require("express-async-handler");
const { DuplicateError } = require("../../middlewares/errorMiddleware");
const SEO = require("../../models/extras/Seo");

// @desc    Create SEO entry
// @route   Get /api/v1/seo/
// @access  Admin
const createSEO = asyncHandler(async (req, res) => {
  try {
    if (req.body.keywords) {
      req.body.keywords = req.body.keywords.split(",");
    }

    const seo = await SEO.create(req.body);
    if (!seo) {
      res.status(400);
      throw new Error("Failed to create SEO entry");
    }

    res.status(201).json({
      message: "SEO entry created successfully",
      data: seo,
      success: true,
    });
  } catch (error) {
    res.status(500);
    DuplicateError(error);
    throw new Error(error);
  }
});

// @desc    Get all SEO entries
// @route   Get /api/v1/seo/
// @access  Admin
const getAllSEO = asyncHandler(async (req, res) => {
  try {
    const seoEntries = await SEO.find();
    if (!seoEntries) {
      res.status(200).json({
        message: "SEO entry not found",
        data: [],
        success: false,
      });
    }

    res.status(200).json({
      message: "SEO entries fetched successfully",
      data: seoEntries,
      success: true,
    });
  } catch (error) {
    res.status(400);
    throw new Error("Failed to fetch SEO entries");
  }
});

// @desc    Get SEO entry by page
// @route   Get /api/v1/seo/:page
// @access  Public
const getSEOByPage = asyncHandler(async (req, res) => {
  try {
    console.log("query>>>>>>", req.query);
    const page = req.query.page;
    const seoEntry = await SEO.aggregate([
      {
        $match: {
          url: page,
        },
      },
    ]);
    if (seoEntry.length === 0) {
      res.status(200).json({
        message: "SEO entry not found",
        data: [],
        success: true,
      });
    }

    res.json({
      message: "SEO entry fetched successfully",
      data: seoEntry[0],
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Failed to fetch SEO entry");
  }
});

// @desc    Get SEO entry by id
// @route   Get /api/v1/seo/:id1
// @access  Admin
const getSEOById = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const seoEntry = await SEO.findById(id);
    if (!seoEntry) {
      res.status(404);
      throw new Error("SEO entry not found");
    }
    res.json({
      message: "SEO entry fetched successfully",
      data: seoEntry,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Failed to fetch SEO entry");
  }
});

// @desc    Update SEO entry
// @route   PUT /api/v1/seo/:id
// @access  Admin
const updateSEO = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;

    if (req.body.keywords) {
      req.body.keywords = req.body.keywords.split(",");
    }
    const seoEntry = await SEO.findByIdAndUpdate(id, req.body, { new: true });
    if (!seoEntry) {
      res.status(400);
      throw new Error("SEO entry not found");
    }
    res.status(200).json({
      message: "SEO entry updated successfully",
      data: seoEntry,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Failed to update SEO entry");
  }
});

// @desc    Delete SEO entry
// @route   DELETE /api/v1/seo/:id
// @access  Admin
const DeleteById = asyncHandler(async (req, res) => {
  try {
    const id = req.query.id;
    const seoEntry = await SEO.findByIdAndDelete(id);
    if (!seoEntry) {
      res.status(404);
      throw new Error("SEO entry not found");
    }
    res.status(204).json({
      message: "SEO entry deleted successfully",
      data: {},
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Failed to delete SEO entry");
  }
});

module.exports = {
  createSEO,
  getAllSEO,
  getSEOById,
  getSEOByPage,
  updateSEO,
  DeleteById,
};
