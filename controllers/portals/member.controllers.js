const asyncHandler = require("express-async-handler");

const Member = require("../../models/portals/Member");
const User = require("../../models/portals/userModel");
const propertyNames = Object.keys(User.schema.obj);
// console.log(propertyNames);
const {
  createMemberValidation,
  updateMemberValidation,
} = require("../../validations/portal/memberValidation");

const {
  createNotificationFormat,
} = require("../../controllers/extras/notification.controllers");
const { createPending } = require("../reports/pending.controllers");

// @desc    Create new Member
// @route   POST /api/member/
// @access  Admin
const createMember = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    let userId = res.locals.userInfo;
    let profile = req.file;

    data.basic_info = JSON.parse(data.basic_info);
    data.political_journey = JSON.parse(data.political_journey);
    data.election_data = JSON.parse(data.election_data);

    // check if profile is available and then add
    if (!profile) {
      res.status(400);
      throw new Error("Please upload a profile");
    }
    data.basic_info.profile = profile;

    // check if user exists and then add it
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }
    data.createdBy = userId.id;

    // validate the data
    const { error } = createMemberValidation(data);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // create a new legislative members
    const member = await Member.create(data);
    if (!member) {
      res.status(400);
      throw new Error("Failed to create a member");
    }

    // notify others
    // let notificationData = {
    //   name: "LegislativeMember",
    //   marathi: {
    //     message: "विधानपरिषद सदस्य जोडले!",
    //   },
    //   english: {
    //     message: "New Legislative Member added!",
    //   },
    // };
    // await createNotificationFormat(notificationData, res);

    // create a pending req to accept
    let pendingData = {
      modelId: member._id,
      modelName: "Member",
      action: "Create",
      data_object: member,
    };
    let notificationMsg = {
      name: `${checkUser.full_name} wants to create Member`,
      marathi: { message: "!" },
      english: { message: "!" },
    };
    await createPending(pendingData, notificationMsg, res);

    res.status(201).json({
      success: true,
      message: "Member create request forwaded!",
      data: member,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get all Member
// @route   GET /api/member/
// @access  Public
const getAllMember = asyncHandler(async (req, res) => {
  try {
    let { perPage, perLimit, ...id } = req.query;

    console.log(id);

    const pageOptions = {
      page: parseInt(perPage, 10) || 0,
      limit: parseInt(perLimit, 10) || 10,
    };

    const members = await Member.find(id)
      .limit(pageOptions.limit)
      .skip(pageOptions.page * pageOptions.limit)
      .exec();

    // check if members exists
    if (!members) {
      res.status(400);
      throw new Error("No members found");
    }

    // send response
    res.status(200).json({
      success: true,
      message: "All the members fetched successfully",
      data: members,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @debsc get all members details According to Options With search And Advaned filter
// @route GET /api/member/memberdetails
// @access Public
const getAllMemberDetails = asyncHandler(async (req, res) => {
  try {
    let { perPage, perLimit } = req.query;
    let obj = {};

    if (req.query.name) {
      obj["basic_info.name"] = req.query.name;
    }
    if (req.query.party) {
      obj["basic_info.party"] = req.query.party;
    }

    if (req.query.constituency) {
      obj["basic_info.constituency"] = req.query.constituency;
    }
    if (req.query.surname) {
      obj["basic_info.surname"] = req.query.surname;
    }
    if (req.query.district) {
      obj["basic_info.district"] = req.query.district;
    }
    if (req.query.gender) {
      obj["basic_info.gender"] = req.query.gender;
    }

    if (req.query.house) {
      obj["basic_info.house"] = req.query.house;
    }
    if (req.query.fullname) {
      // Escape special characters in the search string
      const escapedSearch = req.query.fullname.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );
      // Create a regex pattern that allows any characters between the name parts
      const regexPattern = escapedSearch.split(/\s+/).join(".*");
      console.log("regexPattern", regexPattern);
      obj["$expr"] = {
        " $regexMatch": {
          input: { $concat: ["$basic_info.name", " ", "$basic_info.surname"] },
          regex: regexPattern,
          options: "i",
        },
      };
    }
    console.log("query", obj);

    const pageOptions = {
      page: parseInt(perPage, 10) || 0,
      limit: parseInt(perLimit, 10) || 10,
    };

    const members = await Member.find(obj)
      .populate([
        "basic_info.constituency",
        "basic_info.district",
        "basic_info.party",
        "basic_info.house",
      ])
      .limit(pageOptions.limit)
      .skip(pageOptions.page * pageOptions.limit)
      .exec();

    // check if members exists
    if (!members) {
      res.status(400);
      throw new Error("No members found");
    }

    // send response
    res.status(200).json({
      success: true,
      message: "All the members fetched successfully",
      data: members,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get all Member Options
// @route   GET /api/member/option
// @access  Public

const getMemberFilterOption = asyncHandler(async (req, res) => {
  try {
    let query = req.query.id;

    const debates = await Member.find().distinct(query);
    if (!debates) {
      res.status(400);
      throw new Error("No fields for query: " + query);
    }
    // let debateSet = new Set();

    let newDebates = [];
    debates.map((item) => {
      // item = item.replace(/\s/g, "");
      // debateSet.add(item);
      // if (item && item !== null && item !== undefined) {
      //   return item;
      // }

      if (item) {
        newDebates.push(item);
      }
    });

    // console.log(newDebates);
    newDebates.sort();

    // console.log(newDebates);

    res.status(200).json({
      success: true,
      message: "Debates fetched successfully",
      // data: Array.from(debateSet).sort(),
      data: newDebates,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server error: " + error);
  }
});

// @desc    Get Member based on house
// @route   GET /api/member/house?id=""
// @access  Public
const getMemberHouse = asyncHandler(async (req, res) => {
  try {
    let query = req.query.id;

    console.log(req.query);

    const members = await Member.find({
      "basic_info.house": query,
    });

    // check if members exists
    if (!members) {
      res.status(400);
      throw new Error("No members found");
    }

    res.status(200).json({
      success: true,
      message: `All the legislative members with house ${query} fetched successfully`,
      data: members,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get Member based on query
// @route   GET /api/member/search?id=""
// @access  Public
const getMemberSearch = asyncHandler(async (req, res) => {
  try {
    let search = req.query.id;

    // Escape special characters in the search string
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Create a regex pattern that allows any characters between the name parts
    const regexPattern = escapedSearch.split(/\s+/).join(".*");
    const members = await Member.find({
      $expr: {
        $regexMatch: {
          input: { $concat: ["$basic_info.name", " ", "$basic_info.surname"] },
          regex: regexPattern,
          options: "i",
        },
      },
    });

    // check if members exists
    if (!members) {
      res.status(400);
      throw new Error("No members found");
    }

    res.status(200).json({
      success: true,
      message: `All the members legislative based on ${search} fetched successfully`,
      data: members,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get single Member
// @route   GET /api/member/:id
// @access  Public
const getMember = asyncHandler(async (req, res) => {
  try {
    const member = await Member.findById(req.params.id).populate([
      "basic_info.constituency",
      "basic_info.district",
      "basic_info.party",
      "basic_info.house",
      "election_data.member_election_result.party",
      "election_data.constituency",
    ]);

    member.political_journey.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    // check if member exists
    if (!member) {
      res.status(400);
      throw new Error("No member found");
    }

    res.status(200).json({
      success: true,
      message: "The legislative members fetched successfully",
      data: member,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Update single Member
// @route   PUT /api/member/:id
// @access  Admin
const updateMember = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    let userId = res.locals.userInfo;
    let profile = req.file;

    data.basic_info = JSON.parse(data.basic_info);
    data.political_journey = JSON.parse(data.political_journey);
    data.election_data = JSON.parse(data.election_data);

    // check if member exists
    const memberExists = await Member.findById(req.params.id);
    if (!memberExists) {
      res.status(401);
      throw new Error("No member found");
    }

    // check if user exists and add
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }
    data.updatedBy = userId.id;

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

    // // notify others
    // let notificationData = {
    //   name: "LegislativeMember",
    //   marathi: {
    //     message: "विधानपरिषद सदस्य अपडेट झाले!",
    //   },
    //   english: {
    //     message: "Legislative Member Updated!",
    //   },
    // };
    // await createNotificationFormat(notificationData, res);

    // create a pending req to accept
    let pendingData = {
      modelId: memberExists._id,
      modelName: "Member",
      action: "Update",
      data_object: data,
    };
    let notificationMsg = {
      name: `${checkUser.full_name} wants to update Member`,
      marathi: { message: "!" },
      english: { message: "!" },
    };
    await createPending(pendingData, notificationMsg, res);

    res.status(200).json({
      success: true,
      message: "Legislative Member created successfully",
      data: memberExists,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Delete single Member
// @route   DELETE /api/member/:id
// @access  Admin
const deleteMember = asyncHandler(async (req, res) => {
  try {
    let userId = res.locals.userInfo;

    // check if user exists
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }

    // check if member is present
    const memberExists = await Member.findById(req.params.id);
    if (!memberExists) {
      res.status(404);
      throw new Error("member not found");
    }

    // create a pending req to accept
    let pendingData = {
      modelId: memberExists._id,
      modelName: "Member",
      action: "Delete",
      data_object: memberExists,
    };
    let notificationMsg = {
      name: `${checkUser.full_name} wants to delete Member`,
      marathi: { message: "!" },
      english: { message: "!" },
    };
    await createPending(pendingData, notificationMsg, res);

    res.status(204).json({
      success: true,
      message: "Member delete request forwaded!",
      data: {},
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

module.exports = {
  createMember,
  getAllMember,
  getAllMemberDetails,
  getMemberFilterOption,
  getMemberHouse,
  getMemberSearch,
  getMember,
  updateMember,
  deleteMember,
};
