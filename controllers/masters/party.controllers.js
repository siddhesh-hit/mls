const asyncHandler = require("express-async-handler");

const Party = require("../../models/masters/politicalParty");
const {
  createPartyValidation,
  updatePartyValidation,
} = require("../../validations/master/partyValidation");

// @desc    Create a Party
// @route   /api/v1/party/
// @access  Admin
const createParty = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    data.data = JSON.parse(data.data);

    let newData = data.data;

    let { party_flag, party_symbol } = req.files;
    if (!req.files) {
      res.status(400);
      throw new Error("Please upload files");
    }

    // add files to data
    for (let i = 0; i < newData.length; i++) {
      newData[i].party_flag = party_flag[i];
      newData[i].party_symbol = party_symbol[i];
    }

    // console.log(newData);

    // validate the data
    const { error } = createPartyValidation(newData);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }

    // create new party
    let party = [];
    for (let i = 0; i < newData.length; i++) {
      const createdParty = await Party.create(newData[i]);
      if (!createdParty) {
        res.status(400);
        throw new Error("Party didn't created.");
      }
      party.push(createdParty);
    }

    res.status(201).json({
      message: "Party created successfully.",
      data: party,
      success: true,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Get all Party
// @route   GET /api/party/
// @access  Public
const getAllParty = asyncHandler(async (req, res) => {
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

    // aggregate on the query and send res
    let parties = await await Party.aggregate([
      {
        $match: matchedQuery,
      },
      {
        $facet: {
          party: [
            { $skip: pageOptions.page * pageOptions.limit },
            { $limit: pageOptions.limit },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    if (!parties) {
      res.status(400);
      throw new Error("Couldn't fetch Party.");
    }

    res.status(200).json({
      message: "Party fetched successfully.",
      success: true,
      data: parties[0]?.party || [],
      count: parties[0]?.totalCount[0]?.count || 0,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Get a Party
// @route   GET /api/party/:id
// @access  Public
const getParty = asyncHandler(async (req, res) => {
  try {
    // find one
    const party = await Party.findById(req.params.id);

    if (!party) {
      res.status(400);
      throw new Error("Couldn't fetch Party.");
    }

    res.status(200).json({
      message: "Party fetched successfully.",
      data: party,
      success: true,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Get all master options
// @route   GET /api/party/option
// @access  Public
const getAllOption = asyncHandler(async (req, res) => {
  try {
    let { id, ...queries } = req.query;

    let matchedQuery = {};

    for (let key in queries) {
      if (queries[key]) {
        matchedQuery[key] = new RegExp(`.*${queries[key]}.*`, "i");
      }
    }

    const options = await Party.find(matchedQuery).select([
      "-isActive",
      "-status",
      "-createdBy",
      "-updatedBy",
      "-createdAt",
      "-updatedAt",
    ]);

    res.status(200).json({
      success: true,
      message: "All Party fetched!",
      data: options,
    });
  } catch (error) {
    throw new Error("Server error : " + error);
  }
});

// @desc    Update a Party
// @route   PUT /api/party/:id
// @access  Admin
const updateParty = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    data.data = JSON.parse(data.data);

    let newData = data.data;

    let { party_flag, party_symbol } = req.files;

    // add files to data
    newData.party_flag = party_flag ? party_flag[0] : newData.party_flag;
    newData.party_symbol = party_symbol
      ? party_symbol[0]
      : newData.party_symbol;

    // console.log(newData);

    // validate the data
    const { error } = updatePartyValidation(newData);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }
    // create new party
    const party = await Party.findByIdAndUpdate(req.params.id, newData, {
      new: true,
      runValidators: true,
    });
    if (!party) {
      res.status(400);
      throw new Error("Couldn't fetch Party.");
    }

    res.status(200).json({
      message: "Party updated successfully.",
      data: party,
      success: true,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

// @desc    Delete a Party
// @route   DELETE /api/party/:id
// @access  Admin
const deleteParty = asyncHandler(async (req, res) => {
  try {
    // find one & delete
    const party = await Party.findByIdAndDelete(req.params.id);

    if (!party) {
      res.status(400);
      throw new Error("Couldn't fetch Party.");
    }

    res.status(204).json({
      message: "Party fetched successfully.",
      data: {},
      success: true,
    });
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

module.exports = {
  createParty,
  getAllParty,
  getAllOption,
  getParty,
  updateParty,
  deleteParty,
};
