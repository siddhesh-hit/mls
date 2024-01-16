const asyncHandler = require("express-async-handler");

const MemberLegislative = require("../../models/portals/memberLegislative");
const {
  createMemberValidation,
  updateMemberValidation,
} = require("../../validations/portal/memberValidation");

const {
  createNotificationFormat,
} = require("../../controllers/extras/notification.controllers");

// @desc    Create new legislativeMember
// @route   POST /api/member/
// @access  Admin
const createMember = asyncHandler(async (req, res) => {
  try {
    let data = req.body;

    data.basic_info = JSON.parse(data.basic_info);
    data.political_journey = JSON.parse(data.political_journey);
    data.election_data = JSON.parse(data.election_data);

    let profile = req.file;

    // check if profile is available
    if (!profile) {
      res.status(400);
      throw new Error("Please upload a profile");
    }

    // add the profile to the image
    data.basic_info.profile = profile;

    // validate the data
    const { error } = createMemberValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    console.log(data);

    // create a new legislative members
    const memberLegislative = await MemberLegislative.create(data);

    if (memberLegislative) {
      let notificationData = {
        name: "LegislativeMember",
        marathi: {
          message: "विधानपरिषद सदस्य जोडले!",
        },
        english: {
          message: "New Legislative Member added!",
        },
      };

      await createNotificationFormat(notificationData, res);

      res.status(201).json({
        success: true,
        message: "Legislative Member created successfully",
        data: memberLegislative,
      });
    } else {
      res.status(400);
      throw new Error("Invalid legislative members data");
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get all legislativeMember
// @route   GET /api/member/
// @access  Public
const getAllMember = asyncHandler(async (req, res) => {
  try {
    const members = await MemberLegislative.find({});

    // check if members exists
    if (!members) {
      res.status(400);
      throw new Error("No members found");
    }

    res.status(201).json({
      success: true,
      message: "All the legislative members fetched successfully",
      data: members,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get all legislativeMember
// @route   GET /api/member?house=assembly
// @access  Public
const getMemberHouse = asyncHandler(async (req, res) => {
  try {
    let query = req.query.id;

    console.log(req.query);

    const members = await MemberLegislative.find({
      "basic_info.house": query,
    });

    // check if members exists
    if (!members) {
      res.status(400);
      throw new Error("No members found");
    }

    res.status(201).json({
      success: true,
      message: `All the legislative members with house ${query} fetched successfully`,
      data: members,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get single legislativeMember
// @route   GET /api/member/:id
// @access  Public
const getMember = asyncHandler(async (req, res) => {
  try {
    const member = await MemberLegislative.findById(req.params.id);

    member.political_journey.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    // check if member exists
    if (!member) {
      res.status(400);
      throw new Error("No member found");
    }

    res.status(201).json({
      success: true,
      message: "The legislative members fetched successfully",
      data: member,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Update single legislativeMember
// @route   PUT /api/member/:id
// @access  Admin
const updateMember = asyncHandler(async (req, res) => {
  try {
    let data = req.body;

    data.basic_info = JSON.parse(data.basic_info);
    data.political_journey = JSON.parse(data.political_journey);
    data.election_data = JSON.parse(data.election_data);

    console.log(data);

    let profile = req.file;

    // check if member exists
    const memberExists = await MemberLegislative.findById(req.params.id);
    if (!memberExists) {
      res.status(401);
      throw new Error("No member found");
    }

    // add the profile to the image
    data.basic_info.profile =
      Object.keys(data.basic_info.profile).length === 0
        ? profile
        : memberExists.basic_info.profile;

    // // validate the data
    // const { error } = updateMemberValidation(data);
    // if (error) {
    //   res.status(400);
    //   throw new Error(error.details[0].message);
    // }

    // create a new legislative members
    const memberLegislative = await MemberLegislative.findByIdAndUpdate(
      req.params.id,
      data,
      {
        runValidators: true,
        new: true,
      }
    );

    if (memberLegislative) {
      let notificationData = {
        name: "LegislativeMember",
        marathi: {
          message: "विधानपरिषद सदस्य अपडेट झाले!",
        },
        english: {
          message: "Legislative Member Updated!",
        },
      };

      await createNotificationFormat(notificationData, res);

      res.status(201).json({
        success: true,
        message: "Legislative Member created successfully",
        data: memberLegislative,
      });
    } else {
      res.status(400);
      throw new Error("Invalid legislative members data");
    }
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Delete single legislativeMember
// @route   DELETE /api/member/:id
// @access  Admin
const deleteMember = asyncHandler(async (req, res) => {
  try {
    const member = await MemberLegislative.findByIdAndDelete(req.params.id);

    // check if member exists
    if (!member) {
      res.status(400);
      throw new Error("No member found");
    }

    res.status(201).json({
      success: true,
      message: "The legislative member deleted successfully",
      data: member,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

module.exports = {
  createMember,
  getAllMember,
  getMemberHouse,
  getMember,
  updateMember,
  deleteMember,
};
