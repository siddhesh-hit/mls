const asyncHandler = require("express-async-handler");

const {
  createRajyapalMemberValidation,
  updateRajyapalMemberValidation,
} = require("../validations/rajyapalValidation");
const LegislativeMember = require("../models/rajyapalMember");

// @desc    Create a legislative member
// @route   POST /api/rajyapal
// @access  Private/Admin
const createLegislativeMember = asyncHandler(async (req, res) => {
  try {
    let data = req.body;

    data.marathi = JSON.parse(data.marathi);
    data.english = JSON.parse(data.english);
    data.url = JSON.parse(data.url);
    data.speeches = JSON.parse(data.speeches);

    let { banner, documents } = req.files;

    // check if files exist
    if (!banner || !documents) {
      res.status(400);
      throw new Error("No files found");
    }

    // add image to data
    data.image = banner[0];

    let newSpeeches = [];
    for (let i = 0; i < data.speeches.length; i++) {
      let object = {
        year: data.speeches[i].year,
        values: data.speeches[i].values.map((value) => {
          return {
            language: value.language,
            content: documents[i],
          };
        }),
      };
      // console.log(object, "check");
      newSpeeches.push(object);
    }

    data.speeches = newSpeeches;

    data.speeches.map((val) => {
      console.log(val.values);
    });

    // validate data
    // const { error } = createRajyapalMemberValidation(data);
    // if (error) {
    //   res.status(400);
    //   throw new Error(error.details[0].message);
    // }

    // create new legislative member
    const newLegislativeMember = await LegislativeMember.create(data);
    if (!newLegislativeMember) {
      res.status(400);
      throw new Error("Unable to create legislative member");
    } else {
      res.status(200).json({
        success: true,
        message: "Successfully created legislative member",
        data: newLegislativeMember,
      });
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get all legislative members
// @route   GET /api/rajyapal
// @access  Public
const getALLLegislativeMembers = asyncHandler(async (req, res) => {
  try {
    // get all legislative members
    const legislativeMembers = await LegislativeMember.find();

    // check if legislative members exist
    if (!legislativeMembers) {
      res.status(404);
      throw new Error("No legislative member found");
    }

    // send response
    res.status(200).json({
      success: true,
      message: "Successfully fetched all legislative members",
      data: legislativeMembers,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get legislative member by id
// @route   GET /api/rajyapal/:id
// @access  Public
const getLegislativeMemberById = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;

    // get legislative member by id
    const legislativeMember = await LegislativeMember.findById(id);

    // check if legislative member exist
    if (!legislativeMember) {
      res.status(404);
      throw new Error("No legislative member found");
    }

    // send response
    res.status(200).json({
      success: true,
      message: "Successfully fetched legislative member",
      data: legislativeMember,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Update a legislative member
// @route   PUT /api/rajyapal/:id
// @access  Private/Admin
const updateLegislativeMember = asyncHandler(async (req, res) => {
  try {
    let data = req.body;

    data.marathi = JSON.parse(data.marathi);
    data.english = JSON.parse(data.english);
    data.url = JSON.parse(data.url);

    let { documents } = req.files;

    // validate data
    const { error } = updateRajyapalMemberValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // update legislative member by id
    const updatedLegislativeMember = await LegislativeMember.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    );

    // check if legislative member exist
    if (!updatedLegislativeMember) {
      res.status(404);
      throw new Error("No legislative member found");
    }

    // send response
    res.status(200).json({
      success: true,
      message: "Successfully updated legislative member",
      data: updatedLegislativeMember,
    });
  } catch (error) {}
});

// @desc    Delete a legislative member
// @route   DELETE /api/rajyapal/:id
// @access  Private/Admin
const deleteLegislativeMember = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;

    // delete legislative member by id
    const legislativeMember = await LegislativeMember.findByIdAndDelete(id);

    // check if legislative member exist
    if (!legislativeMember) {
      res.status(404);
      throw new Error("No legislative member found");
    }

    // send response
    res.status(200).json({
      success: true,
      message: "Successfully deleted legislative member",
      data: legislativeMember,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

module.exports = {
  getALLLegislativeMembers,
  getLegislativeMemberById,
  createLegislativeMember,
  updateLegislativeMember,
  deleteLegislativeMember,
};
