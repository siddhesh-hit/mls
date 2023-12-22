const asyncHandler = require("express-async-handler");

const {
  createRajyapalMemberValidation,
  updateRajyapalMemberValidation,
} = require("../validations/rajyapalValidation");
const LegislativeMember = require("../models/rajyapalMember");

const notificationGenerator = require("../utils/notification");

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
      await notificationGenerator("Rajypal", "New Rajypal added!", res);
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

// @desc    Get active and false current data
// @desc    Get active and false current data
// @route   GET /api/rajyapal/active
// @access  Public
const getActiveLegislativeMember = asyncHandler(async (req, res) => {
  try {
    const getActive = await LegislativeMember.find({
      $and: [
        {
          isActive: true,
        },
        {
          isCurrent: false,
        },
      ],
    }).exec();
    if (!getActive) {
      res.status(400);
      throw new Error("No active data found.");
    }
    res.status(201).json({
      message: "Legislative member fetched successfully.",
      data: getActive,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get currect legislative member
// @route   GET /api/rajyapal/current
// @access  Public
const getCurrentLegislativeMember = asyncHandler(async (req, res) => {
  try {
    const getCurrent = await LegislativeMember.findOne({
      isCurrent: true,
    }).exec();

    if (!getCurrent) {
      res.status(400);
      throw new Error("No Current data found.");
    }
    res.status(201).json({
      message: "Legislative member fetched successfully.",
      data: getCurrent,
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
    data.speeches = JSON.parse(data.speeches);
    // data.documents = data.documents.map((doc) => JSON.parse(doc));

    // check if rajyapal exists
    const rajyapalExists = await LegislativeMember.findById(req.params.id);
    if (!rajyapalExists) {
      res.status(400);
      throw new Error("No rajypal found for the existing the id.");
    }

    let { banner, documents } = req.files;

    // add image to data
    data.image = banner ? banner[0] : rajyapalExists.image;

    let newSpeeches = [];
    let countOfDocument = 0;
    for (let i = 0; i < data.speeches.length; i++) {
      let object = {
        year: data.speeches[i].year,
        values: data.speeches[i].values.map((value) => {
          return {
            language: value.language,
            content:
              value.content && Object.keys(value.content).length !== 0
                ? value.content
                : documents[countOfDocument++],
          };
        }),
      };
      // console.log(object.values, "check");
      newSpeeches.push(object);
    }

    data.speeches = newSpeeches;

    // // validate data
    // const { error } = updateRajyapalMemberValidation(data);
    // if (error) {
    //   res.status(400);
    //   throw new Error(error.details[0].message);
    // }

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

    await notificationGenerator("Rajyapal", "Rajyapal updated!", res);

    // send response
    res.status(200).json({
      success: true,
      message: "Successfully updated legislative member",
      data: updatedLegislativeMember,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
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
  getActiveLegislativeMember,
  getCurrentLegislativeMember,
  createLegislativeMember,
  updateLegislativeMember,
  deleteLegislativeMember,
};
