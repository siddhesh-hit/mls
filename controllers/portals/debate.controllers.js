const asyncHandler = require("express-async-handler");

const Debate = require("../../models/portals/Debate");
const PostgresDebate = require("../../models/portals/PostgresDebate");
const User = require("../../models/portals/userModel");
const DumpDebate = require("../../models/portals/DumpDebate");
const {
  createNotificationFormat,
} = require("../../controllers/extras/notification.controllers");
const { marathiToEnglish } = require("../../utils/marathiNumberEng");
const { createPending } = require("../reports/pending.controllers");
const { convertMarToEng } = require("../../utils/convertMarToEng");

// @desc    Create a new Debate
// @route   POST /api/debate/
// @access  Admin
const createDebate = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    let userId = res.locals.userInfo;

    if (!data) {
      res.status(400);
      throw new Error("Fill each fields properly");
    }

    // check if user exists and then add it
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }
    data.createdBy = userId.id;

    // create a debate
    const debate = await Debate.create(data);
    if (!debate) {
      res.status(400);
      throw new Error("Failed to create a debate entry.");
    }

    // // notify others
    // let notificationData = {
    //   name: "Debate",
    //   marathi: {
    //     message: "नवीन Debate जोडले!",
    //   },
    //   english: {
    //     message: "New Debates added!",
    //   },
    // };
    // await createNotificationFormat(notificationData, res);

    // create a pending req to accept
    let pendingData = {
      modelId: debate._id,
      modelName: "Debate",
      action: "Create",
      data_object: debate,
    };
    let notificationMsg = {
      name: `${checkUser.full_name} wants to create Debate`,
      marathi: { message: "!" },
      english: { message: "!" },
    };
    await createPending(pendingData, notificationMsg, res);

    // send response
    res.status(201).json({
      message: "Debate create request forwaded!",
      data: debate,
      success: true,
    });
  } catch (error) {
    res.status(501);
    throw new Error(error);
  }
});

// @desc    Get all Debates
// @route   GET /api/debate/
// @access  Public
const getAllDebates = asyncHandler(async (req, res) => {
  try {
    let { perPage, perLimit, session, house, speaker, keywords } = req.query;

    console.log(req.query);

    // search = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const matchConditions = {};
    if (session) {
      session = session.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      matchConditions["session"] = new RegExp(`.*${session}.*`, "i");
    }
    if (house) {
      house = house.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      matchConditions["house"] = new RegExp(`.*${house}.*`, "i");
    }
    if (speaker) {
      speaker = speaker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      matchConditions["speaker"] = new RegExp(`.*${speaker}.*`, "i");
    }
    if (keywords) {
      keywords = keywords.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      matchConditions["keywords"] = new RegExp(`.*${keywords}.*`, "i");
    }

    console.log(matchConditions);

    // const debate = await Debate.find(obj)
    //   .limit(pageOptions.limit)
    //   .skip(pageOptions.page * pageOptions.limit)
    //   .exec();

    // to look for
    const data = ["session", "house", "speaker", "keywords"];

    const pageOptions = {
      page: parseInt(perPage, 10) || 0,
      limit: parseInt(perLimit, 10) || 10,
    };

    const debate = await Debate.aggregate([
      {
        $match: matchConditions,
      },
      {
        $facet: {
          debate: [
            { $skip: pageOptions.page * pageOptions.limit },
            { $limit: pageOptions.limit },
          ],
          totalCount: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);

    // send response
    res.status(200).json({
      message: "Debates fetched successfully",
      success: true,
      data: debate[0]?.debate || [],
      count: debate[0]?.totalCount[0]?.count || [],
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get all Debates
// @route   GET /api/debate/postgres
// @access  Public
const getpostAllDebates = asyncHandler(async (req, res) => {
  try {
    let { perPage, perLimit, session, house, speaker, keywords } = req.query;

    console.log(req.query);

    // search = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const matchConditions = {};
    if (session) {
      session = session.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      matchConditions["session"] = new RegExp(`.*${session}.*`, "i");
    }
    if (house) {
      house = house.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      matchConditions["house"] = new RegExp(`.*${house}.*`, "i");
    }
    if (speaker) {
      speaker = speaker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      matchConditions["speaker"] = new RegExp(`.*${speaker}.*`, "i");
    }
    if (keywords) {
      keywords = keywords.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      matchConditions["keywords"] = new RegExp(`.*${keywords}.*`, "i");
    }

    // const debate = await Debate.find(obj)
    //   .limit(pageOptions.limit)
    //   .skip(pageOptions.page * pageOptions.limit)
    //   .exec();

    // to look for
    const data = ["session", "house", "speaker", "keywords"];

    const pageOptions = {
      page: parseInt(perPage, 10) || 0,
      limit: parseInt(perLimit, 10) || 10,
    };

    console.log(matchConditions);

    const debate = await PostgresDebate.aggregate([
      {
        $match: matchConditions,
      },
      {
        $facet: {
          debate: [
            { $skip: pageOptions.page * pageOptions.limit },
            { $limit: pageOptions.limit },
          ],
          totalCount: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);

    // send response
    res.status(200).json({
      message: "postgres Debates fetched successfully",
      success: true,
      data: debate[0]?.debate || [],
      count: debate[0]?.totalCount[0]?.count || [],
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get all Debates
// @route   GET /api/debate/dump
// @access  Public
const getnewPostAllDebates = asyncHandler(async (req, res) => {
  try {
    let { perPage, perLimit, ...id } = req.query;

    const pageOptions = {
      page: parseInt(perPage, 10) || 0,
      limit: parseInt(perLimit, 10) || 10,
    };

    // search = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const matchConditions = {};
    for (let key in id) {
      if (id[key]) {
        console.log(id[key], id, key);
        id[key] = id[key].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        matchConditions[key] = new RegExp(`.*${id[key]}.*`, "i");
      }
    }

    // to look for
    console.log(matchConditions);

    const debate = await DumpDebate.aggregate([
      {
        $match: matchConditions,
      },
      {
        $facet: {
          debate: [
            { $skip: pageOptions.page * pageOptions.limit },
            { $limit: pageOptions.limit },
          ],
          totalCount: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);

    // send response
    res.status(200).json({
      message: "Dump Debates fetched successfully",
      success: true,
      data: debate[0]?.debate || [],
      count: debate[0]?.totalCount[0]?.count || [],
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get Debates on basis of house
// @route   GET /api/debate/houses?id=""
// @access  Public
const getHouseDebates = asyncHandler(async (req, res) => {
  try {
    let { perPage, perLimit, id } = req.query;

    const pageOptions = {
      page: parseInt(perPage, 10) || 0,
      limit: parseInt(perLimit, 10) || 10,
    };

    const debates = await Debate.find({
      house: id,
    })
      .limit(pageOptions.limit)
      .skip(pageOptions.page * pageOptions.limit)
      .exec();

    if (!debates) {
      res.status(400);
      throw new Error("No debate found");
    }

    // send response
    res.status(200).json({
      message: "Debates fetched successfully",
      data: debates,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get a Debate by ID
// @route   GET /api/debate/:id
// @access  Public
const getDebateById = asyncHandler(async (req, res) => {
  try {
    const debate = await Debate.findById(req.params.id);

    // check if Debate is present
    if (!debate || debate.status === " Pending") {
      res.status(404);
      throw new Error("Debate not found");
    }

    // send response
    res.status(200).json({
      message: "Debate fetched successfully",
      data: debate,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get a Debate by ID
// @route   GET /api/debate/dump/:id
// @access  Public
const getDumpDebateById = asyncHandler(async (req, res) => {
  try {
    const debate = await DumpDebate.findById(req.params.id);

    // check if Debate is present
    if (!debate) {
      res.status(404);
      throw new Error("Debate not found");
    }

    // send response
    res.status(200).json({
      message: "Debate fetched successfully",
      data: debate,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get Debate based on single query for multiple fields
// @route   GET /api/debate/search?id=""
// @access  Public
const getDebateSearch = asyncHandler(async (req, res) => {
  try {
    let { perPage, perLimit, id } = req.query;

    const pageOptions = {
      page: parseInt(perPage, 10) || 0,
      limit: parseInt(perLimit, 10) || 10,
    };

    const facetPipeline = {};

    // Function to create a pipeline for each condition
    const createPipeline = (field, value) => [
      { $match: { [field]: new RegExp(`.*${value}.*`, "i") } },
      { $skip: pageOptions.page * pageOptions.limit },
      { $limit: pageOptions.limit },
      { $group: { _id: null, data: { $push: "$$ROOT" }, count: { $sum: 1 } } },
    ];

    if (id) {
      id = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      facetPipeline.topic = createPipeline("topic", id);
      facetPipeline.speaker = createPipeline("speaker", id);
      facetPipeline.keywords = createPipeline("keywords", id);
      facetPipeline.members_name = createPipeline("members_name", id);
    }

    const debates = await Debate.aggregate([{ $facet: facetPipeline }]);

    // Process the results to combine data and count
    let combinedData = [];
    let totalCount = 0;

    for (let key in debates[0]) {
      if (debates[0][key].length > 0) {
        const group = debates[0][key][0];
        combinedData.push(...group.data);
        totalCount += group.count;
      }
    }

    // combinedData.slice();

    res.status(200).json({
      success: true,
      message: "Debates fetched successfully",
      data: combinedData,
      count: totalCount,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get Debate based on single query for multiple fields
// @route   GET /api/debate/dumpSearch?id=""
// @access  Public
const getDumpDebateSearch = asyncHandler(async (req, res) => {
  try {
    let { perPage, perLimit, id } = req.query;

    const pageOptions = {
      page: parseInt(perPage, 10) || 0,
      limit: parseInt(perLimit, 10) || 10,
    };

    const facetPipeline = {};

    // Function to create a pipeline for each condition
    const createPipeline = (field, value) => [
      { $match: { [field]: new RegExp(`.*${value}.*`, "i") } },
      { $skip: pageOptions.page * pageOptions.limit },
      { $limit: pageOptions.limit },
      { $group: { _id: null, data: { $push: "$$ROOT" }, count: { $sum: 1 } } },
    ];

    console.log(facetPipeline);

    if (id) {
      id = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      facetPipeline.topic = createPipeline("topic", id);
      facetPipeline.speaker = createPipeline("speaker", id);
      facetPipeline.keywords = createPipeline("keywords", id);
      facetPipeline.members_name = createPipeline("members_name", id);
    }

    const debates = await DumpDebate.aggregate([{ $facet: facetPipeline }]);

    // Process the results to combine data and count
    let combinedData = [];
    let totalCount = 0;

    for (let key in debates[0]) {
      if (debates[0][key].length > 0) {
        const group = debates[0][key][0];
        combinedData.push(...group.data);
        totalCount += group.count;
      }
    }

    // combinedData.slice();

    res.status(200).json({
      success: true,
      message: "dump Debates fetched successfully",
      data: combinedData,
      count: totalCount,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get Debate based on queries including house
// @route   GET /api/debate/member?id=""
// @access  Public
const getMemberDebateSearch = asyncHandler(async (req, res) => {
  try {
    let { perPage, perLimit, houses, name } = req.query;

    console.log(req.query);

    name = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const pageOptions = {
      page: parseInt(perPage, 10) || 0,
      limit: parseInt(perLimit, 10) || 10,
    };

    const debates = await Debate.aggregate([
      {
        $match: {
          $and: [
            { house: houses },
            {
              $or: [
                { topic: new RegExp(`.*${name}.*`, "i") },
                { speaker: new RegExp(`.*${name}.*`, "i") },
                { keywords: new RegExp(`.*${name}.*`, "i") },
                { members_name: new RegExp(`.*${name}.*`, "i") },
              ],
            },
          ],
        },
      },
      {
        $facet: {
          debate: [
            { $skip: pageOptions.page * pageOptions.limit },
            { $limit: pageOptions.limit },
          ],
          totalCount: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Debates fetched successfully",
      data: debates[0].debate,
      count: debates[0].totalCount[0].count,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Get Debate based on multiple query
// @route   GET /api/debate/fields?id=""
// @access  Public
const getDebateFullSearch = asyncHandler(async (req, res) => {
  try {
    let { perPage, perLimit, ...queries } = req.query;

    if (!(Object.keys(queries).length > 0)) {
      throw new Error("Fill query first");
    }

    const pageOptions = {
      page: parseInt(perPage, 10) || 0,
      limit: parseInt(perLimit, 10) || 10,
    };

    // compute the queries in an array for using in and stage
    let arrayOfQuery = Object.keys(queries);
    let andMatchStage = [];

    for (let i = 0; i < arrayOfQuery.length; i++) {
      let key = arrayOfQuery[i];
      let value = queries[arrayOfQuery[i]];

      if (key === "volume" || key === "kramank") {
        let engArr = value.split("");
        let newMarArr;
        if (typeof +engArr[0] === "number") {
          newMarArr = engArr.map((item) => {
            return item;
          });
        } else {
          newMarArr = engArr.map((item) => {
            item = marathiToEnglish[item];
            return item;
          });
        }
        let data = newMarArr.join("");
        value = data;
      }

      if (value && key !== "topic") {
        value = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        let obj = {
          [key]: new RegExp(`.*${value}.*`, "i"),
        };

        andMatchStage.push(obj);
      }

      if (key === "topic") {
        value = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        let or = {
          $or: [
            { topic: new RegExp(`.*${value}.*`, "i") },
            { speaker: new RegExp(`.*${value}.*`, "i") },
            { keywords: new RegExp(`.*${value}.*`, "i") },
            { members_name: new RegExp(`.*${value}.*`, "i") },
            { date: new RegExp(`.*${value}.*`, "i") },
          ],
        };

        andMatchStage.push(or);
      }

      if (key === "house") {
        // value = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        // let obj = {
        //   [key]: new RegExp(`.*${value}.*`, "i"),
        // };
        // andMatchStage.push(obj);
        value = value.replace(/\s+/g, "\\s*");
        let obj = {
          [key]: new RegExp(`.*${value}.*`, "i"),
        };
        andMatchStage.push(obj);
      }
    }

    console.log(andMatchStage);

    let debates;
    if (andMatchStage.length > 0) {
      debates = await Debate.aggregate([
        {
          $match: {
            $and: andMatchStage,
          },
        },
        {
          $facet: {
            debate: [
              { $skip: pageOptions.page * pageOptions.limit },
              { $limit: pageOptions.limit },
            ],
            totalCount: [
              {
                $count: "count",
              },
            ],
          },
        },
      ]);
    } else {
      debates = await Debate.aggregate([
        {
          $facet: {
            debate: [
              { $skip: pageOptions.page * pageOptions.limit },
              { $limit: pageOptions.limit },
            ],
            totalCount: [
              {
                $count: "count",
              },
            ],
          },
        },
      ]);
    }

    res.status(200).json({
      success: true,
      message: "Debates fetched successfully",
      // data: debates,
      data: debates[0]?.debate || [],
      count: debates[0]?.totalCount[0]?.count || 0,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server error: " + error);
  }
});

// @desc    Get Debate based on multiple query
// @route   GET /api/debate/fields?id=""
// @access  Public
const getpostDebateFullSearch = asyncHandler(async (req, res) => {
  try {
    let { perPage, perLimit, ...queries } = req.query;

    if (!(Object.keys(queries).length > 0)) {
      throw new Error("Fill query first");
    }

    const pageOptions = {
      page: parseInt(perPage, 10) || 0,
      limit: parseInt(perLimit, 10) || 10,
    };

    // compute the queries in an array for using in and stage
    let arrayOfQuery = Object.keys(queries);
    let andMatchStage = [];

    // for (let i = 0; i < arrayOfQuery.length; i++) {
    //   let key = arrayOfQuery[i];
    //   let value = queries[arrayOfQuery[i]];

    //   // if (key === "volume" || key === "kramank") {
    //   //   let engArr = value.split("");
    //   //   let newMarArr;
    //   //   if (typeof +engArr[0] === "number") {
    //   //     newMarArr = engArr.map((item) => {
    //   //       return item;
    //   //     });
    //   //   } else {
    //   //     newMarArr = engArr.map((item) => {
    //   //       item = marathiToEnglish[item];
    //   //       return item;
    //   //     });
    //   //   }
    //   //   let data = newMarArr.join("");
    //   //   value = data;
    //   // }

    //   // if (value && key !== "topic") {
    //   //   value = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    //   //   let obj = {
    //   //     [key]: new RegExp(`.*${value}.*`, "i"),
    //   //   };

    //   //   andMatchStage.push(obj);
    //   // }

    //   if (key === "topic") {
    //     value = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    //     let or = {
    //       $or: [
    //         { topic: new RegExp(`.*${value}.*`, "i") },
    //         { keywords: new RegExp(`.*${value}.*`, "i") },
    //       ],
    //     };

    //     andMatchStage.push(or);
    //   }
    // }

    console.log(queries);

    console.log(andMatchStage[0]);

    let debates = await PostgresDebate.aggregate([
      {
        $match: {
          $or: [
            {
              topic: { $regex: queries.topic, $options: "i" },
            },
            {
              keywords: { $regex: queries.topic, $options: "i" },
            },
          ],
        },
      },
      {
        $facet: {
          debate: [
            { $skip: pageOptions.page * pageOptions.limit },
            { $limit: pageOptions.limit },
          ],
          totalCount: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);

    console.log(debates);

    // } else {
    //   debates = await Debate.aggregate([
    //     {
    //       $facet: {
    //         debate: [
    //           { $skip: pageOptions.page * pageOptions.limit },
    //           { $limit: pageOptions.limit },
    //         ],
    //         totalCount: [
    //           {
    //             $count: "count",
    //           },
    //         ],
    //       },
    //     },
    //   ]);
    // }

    res.status(200).json({
      success: true,
      message: "postgres fields Debates fetched successfully",
      // data: debates,
      data: debates[0]?.debate || [],
      count: debates[0]?.totalCount[0]?.count || 0,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server error: " + error);
  }
});

// @desc    Get Debate based on multiple query
// @route   GET /api/debate/dumpFields?id=""
// @access  Public
const getDumpDebateFullSearch = asyncHandler(async (req, res) => {
  try {
    let { perPage, perLimit, ...queries } = req.query;

    if (!(Object.keys(queries).length > 0)) {
      throw new Error("Fill query first");
    }

    const pageOptions = {
      page: parseInt(perPage, 10) || 0,
      limit: parseInt(perLimit, 10) || 10,
    };

    // compute the queries in an array for using in and stage
    let arrayOfQuery = Object.keys(queries);
    let andMatchStage = [];

    // console.log(arrayOfQuery, "array");

    for (let i = 0; i < arrayOfQuery.length; i++) {
      let key = arrayOfQuery[i];
      let value = queries[arrayOfQuery[i]];
      if (
        value &&
        key !== "topic" &&
        key !== "ministry" &&
        key !== "fromdate" &&
        key !== "house" &&
        key !== "todate"
      ) {
        // value = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        let obj = {
          [key]: new RegExp(`.*${decodeURI(value)}.*`, "i"),
        };

        andMatchStage.push(obj);
      }

      if (key === "topic" && queries[key]) {
        // value = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        let or = {
          $or: [
            { topic: new RegExp(`.*${decodeURI(value)}.*`, "i") },
            { speaker: new RegExp(`.*${decodeURI(value)}.*`, "i") },
            { full_text: new RegExp(`.*${decodeURI(value)}.*`, "i") },
            { keywords: new RegExp(`.*${decodeURI(value)}.*`, "i") },
            { members_name: new RegExp(`.*${decodeURI(value)}.*`, "i") },
            { date: new RegExp(`.*${decodeURI(value)}.*`, "i") },
          ],
        };

        andMatchStage.push(or);
      }

      if (key === "house" && queries[key]) {
        // value = value.replace(/\s+/g, "\\s*");
        let obj = {
          [key]: new RegExp(`.*${decodeURI(value)}.*`, "i"),
        };
        andMatchStage.push(obj);
      }

      if (key === "ministry" && queries[key]) {
        let obj = {
          [key]: new RegExp(`.*${decodeURI(value)}.*`, "i"),
        };
        andMatchStage.push(obj);
      }

      if (key === "fromdate" && queries["fromdate"]) {
        let fromDateSplit = queries["fromdate"].split("-");
        let newFromDate = `${fromDateSplit[2]}-${fromDateSplit[1]}-${fromDateSplit[0]}`;

        let toDateSplit = queries["todate"].split("-");
        let newToDate = `${toDateSplit[2]}-${toDateSplit[1]}-${toDateSplit[0]}`;

        console.log(newFromDate, newToDate);

        let obj = {
          newDate: {
            $gte: new Date(newFromDate),
            $lt: new Date(queries["todate"]) || new Date(newToDate),
          },
        };
        andMatchStage.push(obj);
      }
    }
    // console.log(andMatchStage[0]);

    console.log(andMatchStage);

    let debates;
    if (andMatchStage.length > 0) {
      debates = await DumpDebate.aggregate([
        {
          $match: {
            $and: andMatchStage,
          },
        },
        {
          $facet: {
            debate: [
              { $skip: pageOptions.page * pageOptions.limit },
              { $limit: pageOptions.limit },
            ],
            totalCount: [
              {
                $count: "count",
              },
            ],
          },
        },
      ]);
    } else {
      debates = await DumpDebate.aggregate([
        {
          $facet: {
            debate: [
              { $skip: pageOptions.page * pageOptions.limit },
              { $limit: pageOptions.limit },
            ],
            totalCount: [
              {
                $count: "count",
              },
            ],
          },
        },
      ]);
    }

    // console.log(debates);

    res.status(200).json({
      success: true,
      message: "dump Debates fetched successfully",
      data: debates[0]?.debate || [],
      count: debates[0]?.totalCount[0]?.count || 0,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server error: " + error);
  }
});

// @desc    Update a Debate by ID
// @route   PUT /api/debate/:id
// @access  Admin
const updateDebateById = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    let userId = res.locals.userInfo;

    // check if user exists
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }

    // check if Debate is present & update
    const debate = await Debate.findById(req.params.id);
    if (!debate) {
      res.status(404);
      throw new Error("Debate not found");
    }
    debate.updatedBy = userId.id;

    // // notify others
    // let notificationData = {
    //   name: "Debate",
    //   marathi: {
    //     message: "Debates अपडेट झाले!",
    //   },
    //   english: {
    //     message: "Debates Updated!",
    //   },
    // };
    // await createNotificationFormat(notificationData, res);

    // create a pending req to accept
    let pendingData = {
      modelId: debate._id,
      modelName: "Debate",
      action: "Update",
      data_object: data,
    };
    let notificationMsg = {
      name: `${checkUser.full_name} wants to update Debate`,
      marathi: { message: "!" },
      english: { message: "!" },
    };
    await createPending(pendingData, notificationMsg, res);

    // send response
    res.status(200).json({
      message: "Debate updated request forwaded!",
      data: debate,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// @desc    Delete a Debate by ID
// @route   DELETE /api/debate/:id
// @access  Admin
const deleteDebateById = asyncHandler(async (req, res) => {
  try {
    let userId = res.locals.userInfo;

    // check is user exists
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }

    // check if Debate is present
    const debateExists = await Debate.findById(req.params.id);
    if (!debateExists) {
      res.status(404);
      throw new Error("Debate not found");
    }

    // create a pending req to accept
    let pendingData = {
      modelId: req.params.id,
      modelName: "Debate",
      action: "Delete",
      data_object: debateExists,
    };
    let notificationMsg = {
      name: `${checkUser.full_name} wants to delete debate.`,
      marathi: { message: "!" },
      english: { message: "!" },
    };
    await createPending(pendingData, notificationMsg, res);

    // send response
    res.status(200).json({
      message: "Debate deleted request forwaded successfully",
      data: {},
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error);
  }
});

// <--- SELECT OPTION FROM DEBATE DATABASE --->

// @desc    Get all distinct values for options
// @route   GET /api/debate/option?id=
// @access  Public
const getDebateFilterOption = asyncHandler(async (req, res) => {
  try {
    let query = req.query.id;

    const debates = await Debate.find().distinct(query);

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

// @desc    Get all distinct values for options
// @route   GET /api/debate/dumpOption?id=
// @access  Public
const getDumpDebateFilterOption = asyncHandler(async (req, res) => {
  try {
    let { id, ...queries } = req.query;

    let matchedQuery = {};

    for (let key in queries) {
      if (queries[key] && key !== "fromdate" && key !== "todate") {
        matchedQuery[key] = new RegExp(`.*${queries[key]}.*`, "i");
      }
      if (key !== "fromdate" && queries["fromdate"]) {
        let fromDateSplit = queries["fromdate"].split("-");
        let fromDate = `${fromDateSplit[2]}-${fromDateSplit[1]}-${fromDateSplit[0]}`;

        let toDateSplit = queries["todate"].split("-");
        let toDate = `${toDateSplit[2]}-${toDateSplit[1]}-${toDateSplit[0]}`;

        let obj = {
          newDate: {
            $gte: new Date(fromDate),
            $lt: new Date(toDate),
          },
        };
        matchedQuery["newDate"] = obj.newDate;
      }
    }

    // console.log(matchedQuery, `for ${id}`)

    const debates = await DumpDebate.find(matchedQuery).distinct(id);

    if (!debates) {
      res.status(400);
      throw new Error("No fields for query: " + id);
    }

    // let debateSet = new Set();

    let newDebates = [];
    debates.map((item) => {
      if (item) {
        newDebates.push(item);
      }
    });

    // console.log(newDebates);
    newDebates.sort();

    // console.log(newDebates);
    let newFilter;
    if (id === "kramank" || id === "volume") {
      newFilter = convertMarToEng(newDebates);
    } else {
      newFilter = newDebates;
    }
    res.status(200).json({
      success: true,
      message: "Debates fetched successfully",
      data: newFilter,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server error: " + error);
  }
});

// @desc    Get all distinct values for options
// @route   GET /api/debate/option?id=
// @access  Public
const getDebateMethodFilterOption = asyncHandler(async (req, res) => {
  try {
    let query = req.query.id;

    const debates = await Debate.find().distinct(query);

    if (!debates) {
      res.status(400);
      throw new Error("No fields for query: " + query);
    }

    let debateSet = new Set();

    debates.map((item) => {
      item = item.replace(/\s/g, "");
      debateSet.add(item);
    });

    console.log(debateSet);

    res.status(200).json({
      success: true,
      message: "Debates fetched successfully",
      data: Array.from(debateSet).sort(),
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server error: " + error);
  }
});

module.exports = {
  createDebate,
  getAllDebates,
  getDebateById,
  getDumpDebateById,
  getHouseDebates,
  getDebateSearch,
  getDumpDebateSearch,
  getMemberDebateSearch,
  getpostAllDebates,
  getnewPostAllDebates,
  getpostDebateFullSearch,
  getDumpDebateFullSearch,
  getDebateFullSearch,
  updateDebateById,
  deleteDebateById,
  getDebateFilterOption,
  getDumpDebateFilterOption,
  getDebateMethodFilterOption,
};
