const asyncHandler = require("express-async-handler");

const Debate = require("../../models/portals/Debate");

const {
  createNotificationFormat,
} = require("../../controllers/extras/notification.controllers");

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
      { $skip: pageOptions.page * pageOptions.limit },
      { $limit: pageOptions.limit },
    ]);

    // send response
    res.status(200).json({
      message: "Debates fetched successfully",
      data: debate,
      success: true,
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

// @desc    Get Debate based on query
// @route   GET /api/debate/search?id=""
// @access  Public
// const getDebateSearch = asyncHandler(async (req, res) => {
//   try {
//     let { perPage, perLimit, speaker, topic, keywords, members_name } =
//       req.query;

//     // console.log(req.query);

//     const matchConditions = [];
//     if (topic) {
//       topic = topic.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
//       let obj = { topic: new RegExp(`.*${topic}.*`, "i") };
//       matchConditions.push(obj);
//     }

//     if (speaker) {
//       speaker = speaker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
//       let obj = { speaker: new RegExp(`.*${speaker}.*`, "i") };
//       matchConditions.push(obj);
//     }

//     if (keywords) {
//       keywords = keywords.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
//       let obj = { keywords: new RegExp(`.*${keywords}.*`, "i") };
//       matchConditions.push(obj);
//     }

//     if (members_name) {
//       members_name = members_name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
//       let obj = { members_name: new RegExp(`.*${members_name}.*`, "i") };
//       matchConditions.push(obj);
//     }

//     const pageOptions = {
//       page: parseInt(perPage, 10) || 0,
//       limit: parseInt(perLimit, 10) || 10,
//     };

//     console.log(matchConditions);

//     const debates = await Debate.aggregate([
//       {
//         $facet: {
//           data: [
//             {
//               $match: { $or: matchConditions },
//             },
//             { $skip: pageOptions.page * pageOptions.limit },
//             { $limit: pageOptions.limit },
//           ],
//           count: [
//             {
//               $match: { $or: matchConditions },
//             },
//             { $count: "count" },
//           ],
//         },
//       },
//     ]);

//     res.status(200).json({
//       success: true,
//       message: `All the debates legislative based on ${topic} fetched successfully`,
//       data: debates[0].data,
//       count: debates[0].count.length > 0 ? debates[0].count[0].count : 0,
//     });
//   } catch (error) {
//     res.status(500);
//     throw new Error(error);
//   }
// });
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

// @desc    Get Debate based on different query search
// @route   GET /api/debate/search?id=""
// @access  Public
// const getDebateSearch = asyncHandler(async (req, res) => {
//   try {
//     let { perPage, perLimit, speaker, topic, keywords, members_name } =
//       req.query;

//     const pageOptions = {
//       page: parseInt(perPage, 10) || 0,
//       limit: parseInt(perLimit, 10) || 10,
//     };

//     const facetPipeline = {};

//     // Function to create a pipeline for each condition
//     const createPipeline = (field, value) => [
//       { $match: { [field]: new RegExp(`.*${value}.*`, "i") } },
//       { $skip: pageOptions.page * pageOptions.limit },
//       { $limit: pageOptions.limit },
//       { $group: { _id: null, data: { $push: "$$ROOT" }, count: { $sum: 1 } } },
//     ];

//     if (topic) {
//       topic = topic.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
//       facetPipeline.topic = createPipeline("topic", topic);
//     }

//     if (speaker) {
//       speaker = speaker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
//       facetPipeline.speaker = createPipeline("speaker", speaker);
//     }

//     if (keywords) {
//       keywords = keywords.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
//       facetPipeline.keywords = createPipeline("keywords", keywords);
//     }

//     if (members_name) {
//       members_name = members_name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
//       facetPipeline.members_name = createPipeline("members_name", members_name);
//     }

//     const debates = await Debate.aggregate([{ $facet: facetPipeline }]);

//     // Process the results to combine data and count
//     let combinedData = [];
//     let totalCount = 0;

//     for (let key in debates[0]) {
//       if (debates[0][key].length > 0) {
//         const group = debates[0][key][0];
//         combinedData.push(...group.data);
//         totalCount += group.count;
//       }
//     }

//     // combinedData.slice();

//     res.status(200).json({
//       success: true,
//       message: "Debates fetched successfully",
//       data: combinedData,
//       count: totalCount,
//     });
//   } catch (error) {
//     res.status(500);
//     throw new Error(error);
//   }
// });

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

module.exports = {
  createDebate,
  getAllDebates,
  getDebateById,
  getHouseDebates,
  getDebateSearch,
  updateDebateById,
  deleteDebateById,
};
