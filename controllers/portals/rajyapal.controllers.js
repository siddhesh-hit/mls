const asyncHandler = require("express-async-handler");

const RajyapalMember = require("../../models/portals/rajyapalMember");
const User = require("../../models/portals/userModel");

const {
  createRajyapalMemberValidation,
  updateRajyapalMemberValidation,
} = require("../../validations/portal/rajyapalValidation");

const {
  createNotificationFormat,
} = require("../../controllers/extras/notification.controllers");
const { createPending } = require("../reports/pending.controllers");

// @desc    Create a legislative member
// @route   POST /api/rajyapal
// @access  Private/Admin
const createLegislativeMember = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    let userId = res.locals.userInfo;
    let { banner, documents } = req.files;

    data.marathi = JSON.parse(data.marathi);
    data.english = JSON.parse(data.english);
    data.url = JSON.parse(data.url);
    data.speeches = JSON.parse(data.speeches);

    // check if files exist
    if (!banner || !documents) {
      res.status(400);
      throw new Error("No files found");
    }

    // add image to data
    data.image = banner[0];

    // add speeches doc to specific speech
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

    // check if user exists and then add it
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }
    data.createdBy = userId.id;

    // validate data
    // const { error } = createRajyapalMemberValidation(data);
    // if (error) {
    //   res.status(400);
    //   throw new Error(error.details[0].message);
    // }

    // create new legislative member
    const newLegislativeMember = await RajyapalMember.create(data);
    if (!newLegislativeMember) {
      res.status(400);
      throw new Error("Failed to create rajyapal member");
    }

    // // notify others
    // let notificationData = {
    //   name: "Rajypal",
    //   marathi: {
    //     message: "नवीन राजपाल जोडले!",
    //   },
    //   english: {
    //     message: "New Rajypal added!",
    //   },
    // };
    // await createNotificationFormat(notificationData, res);

    // create a pending req to accept
    let pendingData = {
      modelId: newLegislativeMember._id,
      modelName: "RajyapalMember",
      action: "Create",
    };
    let notificationMsg = {
      name: `${checkUser.full_name} wants to create RajyapalMember`,
      marathi: { message: "!" },
      english: { message: "!" },
    };
    await createPending(pendingData, notificationMsg, res);

    res.status(201).json({
      success: true,
      message: "Rajyapal create request forwaded!",
      data: newLegislativeMember,
    });
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
    let { perPage, perLimit, ...id } = req.query;

    const pageOptions = {
      page: parseInt(perPage, 10) || 0,
      limit: parseInt(perLimit, 10) || 10,
    };

    // get all legislative members
    const legislativeMembers = await RajyapalMember.find(id)
      .limit(pageOptions.limit)
      .skip(pageOptions.page * pageOptions.limit)
      .exec();

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
    const getActive = await RajyapalMember.find({
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
    res.status(200).json({
      message: "Legislative member fetched successfully.",
      data: getActive,
      success: true,
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
    const getCurrent = await RajyapalMember.findOne({
      isCurrent: true,
    }).exec();

    if (!getCurrent) {
      res.status(400);
      throw new Error("No Current data found.");
    }
    res.status(200).json({
      message: "Legislative member fetched successfully.",
      data: getCurrent,
      success: true,
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
    const legislativeMember = await RajyapalMember.findById(id);

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
    let userId = res.locals.userInfo;
    let { banner, documents } = req.files;

    data.marathi = JSON.parse(data.marathi);
    data.english = JSON.parse(data.english);
    data.url = JSON.parse(data.url);
    data.speeches = JSON.parse(data.speeches);
    // data.documents = data.documents.map((doc) => JSON.parse(doc));

    // check if rajyapal exists
    const rajyapalExists = await RajyapalMember.findById(req.params.id);
    if (!rajyapalExists) {
      res.status(400);
      throw new Error("No rajypal found for the existing the id.");
    }

    // add image to data
    data.image = banner ? banner[0] : rajyapalExists.image;

    // add speeches doc to specific speech
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

    // check if user exists and add
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }
    data.updatedBy = userId.id;

    // // validate data
    // const { error } = updateRajyapalMemberValidation(data);
    // if (error) {
    //   res.status(400);
    //   throw new Error(error.details[0].message);
    // }

    // // notify others
    // let notificationData = {
    //   name: "Rajyapal",
    //   marathi: {
    //     message: "राजपाल अपडेट झाले!",
    //   },
    //   english: {
    //     message: "Rajyapal updated!",
    //   },
    // };
    // await createNotificationFormat(notificationData, res);

    // create a pending req to accept
    let pendingData = {
      modelId: rajyapalExists._id,
      modelName: "RajyapalMember",
      action: "Update",
      data_object: data,
    };
    let notificationMsg = {
      name: `${checkUser.full_name} wants to update RajyapalMember`,
      marathi: { message: "!" },
      english: { message: "!" },
    };
    await createPending(pendingData, notificationMsg, res);

    // send response
    res.status(200).json({
      success: true,
      message: "Legislative member update request forwaded!",
      data: rajyapalExists,
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
    let id = req.params.id;
    let userId = res.locals.userInfo;

    // check if user exists
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }

    // check if legislative member exist
    const legislativeMember = await RajyapalMember.findById(id);
    if (!legislativeMember) {
      res.status(404);
      throw new Error("No legislative member found");
    }

    // create a pending req to accept
    let pendingData = {
      modelId: legislativeMember._id,
      modelName: "RajyapalMember",
      action: "Delete",
    };
    let notificationMsg = {
      name: `${checkUser.full_name} wants to delete RajyapalMember`,
      marathi: { message: "!" },
      english: { message: "!" },
    };
    await createPending(pendingData, notificationMsg, res);

    // send response
    res.status(204).json({
      success: true,
      message: "Successfully deleted legislative member",
      data: {},
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
