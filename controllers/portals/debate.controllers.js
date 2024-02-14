const asyncHandler = require("express-async-handler");

const Debate = require("../../models/portals/Debate");

const {
  createNotificationFormat,
} = require("../../controllers/extras/notification.controllers");
const { marathiToEnglish } = require("../../utils/marathiNumberEng");

// @desc    Create a new Debate
// @route   POST /api/debate/
// @access  Admin
const createDebate = asyncHandler(async (req, res) => {
  try {
    let data = req.body;

    let notificationData = {
      name: "Debate",
      marathi: {
        message: "नवीन Debate जोडले!",
      },
      english: {
        message: "New Debates added!",
      },
    };

    await createNotificationFormat(notificationData, res);

    res.status(201).json({
      message: "Debate created successfully",
      //   data: Debates,
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

      // if(t)

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
      if (value) {
        value = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
      // No queries provided, return all debates
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
      count: debates[0]?.totalCount[0]?.count || [],
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
    const debate = await Debate.findById(req.params.id);

    // check if Debate is present
    if (!debate) {
      res.status(404);
      throw new Error("Debate not found");
    }

    const updatedDebate = await Debate.findByIdAndUpdate(req.params.id, data, {
      runValidators: true,
      new: true,
    });

    // check and send response
    if (!updatedDebate) {
      res.status(400);
      throw new Error("Something went wrong");
    }

    let notificationData = {
      name: "Debate",
      marathi: {
        message: "Debates अपडेट झाले!",
      },
      english: {
        message: "Debates Updated!",
      },
    };

    await createNotificationFormat(notificationData, res);

    res.status(200).json({
      message: "Debate updated successfully",
      data: updatedDebate,
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
    // check if Debate is present
    const debateExists = await Debate.findById(req.params.id);
    if (!debateExists) {
      res.status(404);
      throw new Error("Debate not found");
    }

    // delete the Debate
    const deletedDebate = await Debate.findByIdAndDelete(req.params.id);

    // check and send response
    if (!deletedDebate) {
      res.status(400);
      throw new Error("Something went wrong");
    } else {
      res.status(204).json({
        message: "Debate deleted successfully",
        data: {},
        success: true,
      });
    }
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
  getHouseDebates,
  getDebateSearch,
  getMemberDebateSearch,
  getDebateFullSearch,
  updateDebateById,
  deleteDebateById,
  getDebateFilterOption,
  getDebateMethodFilterOption,
};
