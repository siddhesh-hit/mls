const asyncHandler = require("express-async-handler");
const { ObjectId } = require("mongodb");
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
} = require("../extras/notification.controllers");
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
    if (data.basic_info.house === "Council") {
      data.basic_info.assembly_number = null;
    }

    // check if user exists and then add it
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }
    data.createdBy = userId.id;

    data.political_journey.map((item) => {
      // if(item.presiding !== '' ||)
      for (key in item) {
        console.log(key, item[key]);
        if (item[key] === "") {
          // console.log(item, "ye hai ==>");
          item[key] = null;
        }
      }
    });

    console.log(data.political_journey);

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

    let members = await Member.aggregate([
      {
        $match: matchedQuery,
      },
      {
        $facet: {
          member: [
            { $skip: pageOptions.page * pageOptions.limit },
            { $limit: pageOptions.limit },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    // send response
    res.status(200).json({
      message: "All the members fetched successfully",
      success: true,
      data: members[0]?.member || [],
      count: members[0]?.totalCount[0]?.count || 0,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get all Member
// @route   GET /api/member/all
// @access  Public
const getAllMemberOption = asyncHandler(async (req, res) => {
  try {
    let { ...id } = req.query;
    // filter the query
    let matchedQuery = {};

    for (key in id) {
      if (id[key] !== "" && key !== "basic_info.assembly_number") {
        id[key] = id[key].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        matchedQuery[key] = new RegExp(`.*${id[key]}.*`, "i");
      }

      if (key === "basic_info.assembly_number" && id[key] !== "") {
        matchedQuery["basic_info.assembly_number"] = new ObjectId(id[key]);
      }
    }

    let members = await Member.find(matchedQuery);

    // send response
    res.status(200).json({
      message: "All the members fetched successfully",
      success: true,
      data: members || [],
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc get all members details According to Options With search And Advaned filter
// @route GET /api/member/memberdetails
// @access Public
const getAllMemberDetails = asyncHandler(async (req, res) => {
  try {
    let { perPage, perLimit } = req.query;
   
      
    // Define  Pipepliene
    const pipeline = []
    const pageOptions = {
      page: parseInt(perPage, 10) || 0,
      limit: parseInt(perLimit, 10) || 10,
      // limit: 1,
    };
    let matchedQuery = {};

    if (req.query.name) {
      matchedQuery["basic_info.name"] = req.query.name;
    }
    if(req.query.constituency_types ) {
      if(req.query.constituency_types) {
        matchedQuery["basic_info.constituency"] =new ObjectId(req.query.constituency_types);
      }
    }
    if (req.query.party) {
      matchedQuery["basic_info.party"] = new ObjectId(req.query.party);
    }

    if (req.query.constituency) {
      matchedQuery["basic_info.constituency"] = new ObjectId(
        req.query.constituency
      );
    }
    if (req.query.surname) {
      matchedQuery["basic_info.surname"] = req.query.surname;
    }
    if (req.query.district) {
      matchedQuery["basic_info.district"] = new ObjectId(req.query.district);
    }
    if (req.query.gender) {
      matchedQuery["basic_info.gender"] = new ObjectId(req.query.gender);
    }
    if (req.query.assembly_number) {
      matchedQuery["basic_info.assembly_number"] = new ObjectId(req.query.assembly_number);
    }

    if (req.query.house) {
      matchedQuery["basic_info.house"] = req.query.house;
       let fromDate ,toDate;
      if(req.query.fromdate && req.query.todate) {
         fromDate = new Date(req.query.fromdate).getFullYear();
        toDate = new Date(req.query.todate).getFullYear();
        fromDate = new Date(fromDate, 0, 1);
        toDate = new Date(toDate, 11, 31);
      }
      // designation
      if (req.query.designation) {
         matchedQuery["political_journey"] = {$elemMatch:{
          designation: new ObjectId(req.query.designation) ,
         }}
      }
      // presiding
      if (req.query.presiding) {
        matchedQuery["political_journey"] = {$elemMatch:{
          presiding: new ObjectId(req.query.presiding) ,
          }}
      }
      // legislative_position
      if (req.query.legislative_position) {
        matchedQuery["political_journey"] = {$elemMatch:{
          legislative_position: new ObjectId(req.query.legislative_position) ,
        }}
      }
      // From Date and To Date
      if (req.query.fromdate && req.query.todate && req.query.house === "Council") {
        matchedQuery["$and"] = [
          { "basic_info.constituency_from": { $gte:fromDate} },
          { "basic_info.constituency_to": { $lte : toDate} }
        ]
      }
      else if (req.query.fromdate && req.query.todate && req.query.house === "Assembly") {
        // Convert the date strings to actual Date objects

        pipeline.push({
          $lookup: {
            from: "assemblies",
            localField: "basic_info.assembly_number",
            foreignField: "_id",
            as: "assemblies",
          },
        });
        pipeline.push({
          $unwind: "$assemblies",
        });
        // // Add the $match stage after $unwind to filter based on start_date and end_date
        matchedQuery["$and"] = [
          {
            'assemblies.start_date': {
               $gte:fromDate 
            }
          }, {
            'assemblies.end_date': {
              $lte : toDate
            }
          }
        ]

        
      }

    }
    if (req.query.fullname) {
      // Escape special characters in the search string
      const escapedSearch = req.query.fullname.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );
      // Create a regex pattern that allows any characters between the name parts
      const regexPattern = escapedSearch.split(/\s+/).join(".*");
      // console.log("regexPattern", regexPattern);
      matchedQuery["$expr"] = {
        $regexMatch: {
          input: { $concat: ["$basic_info.name", " ", "$basic_info.surname"] },
          regex: regexPattern,
          options: "i",
        },
      };
    }
    pipeline.push({
      $match: matchedQuery,
    })
    pipeline.push({
      $facet: {
        mem: [

          { $sort: { "basic_info.surname": 1 } },
          { $skip: pageOptions.page * pageOptions.limit },
          { $limit: pageOptions.limit },
        ],
        totalCount: [{ $count: "count" }],
      },
    })
    // aggregate on the query
    const members = await Member.aggregate(pipeline);

    // console.log(members[0]?.mem?.map((item) => item.assemblies))

    // check if members exists
    if (!members) {
      res.status(400);
      throw new Error("No members found");
    }

    const populateMember = await Member.populate(members[0]?.mem, [
      { path: "basic_info.constituency" },
      { path: "basic_info.party" },
      { path: "basic_info.district" },
      { path: "basic_info.assembly_number" },
    ]);

    // send response
    res.status(200).json({
      success: true,
      message: "All the members fetched successfully",
      data: populateMember || [],
      count: members[0]?.totalCount[0]?.count || 0,
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
    let { id, ...query } = req.query;

    let matchedQuery = {};

    for (key in query) {
      if (query[key] !== "") {
        matchedQuery[key] = query[key];
      }
    }
    const debates = await Member.find(matchedQuery).distinct(id).sort();
    if (!debates) {
      res.status(400);
      throw new Error("No fields for query: " + query);
    }
    // let debateSet = new Set();

    // console.log(newDebates);

    res.status(200).json({
      success: true,
      message: "Debates fetched successfully",
      // data: Array.from(debateSet).sort(),
      data: debates,
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

    // console.log(req.query);

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
      "basic_info.assembly_number",
      "basic_info.constituency",
      "basic_info.district",
      "basic_info.party",
      "basic_info.gender",
      "basic_info.house",
      "election_data.member_election_result.party",
      "election_data.constituency",
      "political_journey.presiding",
      "political_journey.legislative_position",
      "political_journey.designation",
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

    console.log(data);

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
  getAllMemberOption,
  getAllMemberDetails,
  getMemberFilterOption,
  getMemberHouse,
  getMemberSearch,
  getMember,
  updateMember,
  deleteMember,
};
