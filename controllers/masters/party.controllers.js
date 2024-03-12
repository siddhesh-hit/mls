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
    // find all
    const parties = await Party.find({}).select("marathi english _id");

    if (!parties) {
      res.status(400);
      throw new Error("Couldn't fetch Party.");
    }

    res.status(200).json({
      message: "Party fetched successfully.",
      data: parties,
      success: true,
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
  getParty,
  updateParty,
  deleteParty,
};
