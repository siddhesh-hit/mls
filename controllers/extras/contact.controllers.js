const asyncHandler = require("express-async-handler");

const ContactUs = require("../../models/extras/Contact");
const User = require("../../models/portals/userModel");

const { createPending } = require("../reports/pending.controllers");

// @desc    Create a session
// @path    POST /api/contact/
// @access  Public
const createContact = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    let userId = res.locals.userInfo;

    // validate
    if (
      !data.address ||
      !(data.telephone?.length > 0) ||
      !(data.fax?.length > 0) ||
      !data.email ||
      !data.map_url
    ) {
      res.status(400);
      throw new Error("Field data properly.");
    }

    // check if user exists and then add it
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }
    data.createdBy = userId.id;

    // create an entry
    const contact = await ContactUs.create(data);
    if (!contact) {
      res.status(400);
      throw new Error("Failed to create a Contact");
    }

    // create a pending req to accept
    let pendingData = {
      modelId: contact._id,
      modelName: "ContactUs",
      action: "Create",
    };
    let notificationMsg = {
      name: `${checkUser.full_name} wants to create Contact`,
      marathi: { message: "!" },
      english: { message: "!" },
    };
    await createPending(pendingData, notificationMsg, res);

    res.status(201).json({
      data: contact,
      message: "Contact create request forwaded!",
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error: " + error);
  }
});

// @desc    Get all session
// @path    GET /api/contact/
// @access  Public
const getContacts = asyncHandler(async (req, res) => {
  try {
    let { perPage, perLimit, ...id } = req.query;

    const pageOptions = {
      page: parseInt(perPage, 10) || 0,
      limit: parseInt(perLimit, 10) || 10,
    };

    const contact = await ContactUs.find(id)
      .limit(pageOptions.limit)
      .skip(pageOptions.page * pageOptions.limit)
      .exec();

    // check if contact exists
    if (!contact) {
      res.status(404);
      throw new Error("No contact found");
    }

    // send response
    res.status(200).json({
      message: "contact fetched successfully",
      data: contact,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error: " + error);
  }
});

// @desc    Get a session
// @path    GET /api/contact/:id
// @access  Public
const getContact = asyncHandler(async (req, res) => {
  try {
    // check whether exists and send res
    const contact = await ContactUs.findById(req.params.id);
    if (!contact) {
      res.status(400);
      throw new Error("No contact found for provided id.");
    }
    res.status(200).json({
      message: "contact fetched successfully.",
      data: contact,
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error: " + error);
  }
});

// @desc    Update a session
// @path    PUT /api/contact/:id
// @access  Public
const updateContact = asyncHandler(async (req, res) => {
  try {
    let data = req.body;
    let userId = res.locals.userInfo;

    // validate
    if (
      !data.address ||
      !(data.telephone?.length > 0) ||
      !(data.fax?.length > 0) ||
      !data.email ||
      !data.map_url
    ) {
      res.status(400);
      throw new Error("Field data properly.");
    }

    // check if Contact exists
    const checkContact = await ContactUs.findById(req.params.id);
    if (!checkContact) {
      res.status(400);
      throw new Error("Failed to find a ContactUs.");
    }

    // check if user exists and then add it
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }
    data.updatedBy = userId.id;

    // create a pending req to accept
    let pendingData = {
      modelId: checkContact._id,
      modelName: "ContactUs",
      action: "Update",
      data_object: data,
    };
    let notificationMsg = {
      name: `${checkUser.full_name} wants to update Contact`,
      marathi: { message: "!" },
      english: { message: "!" },
    };
    await createPending(pendingData, notificationMsg, res);

    res.status(200).json({
      data: checkContact,
      message: "Contact update request forwaded!",
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error: " + error);
  }
});

// @desc    Delete a session
// @path    DELETE /api/contact/:id
// @access  Public
const deleteContact = asyncHandler(async (req, res) => {
  try {
    let userId = res.locals.userInfo;

    // check if user exists
    const checkUser = await User.findById(userId.id);
    if (!checkUser) {
      res.status(400);
      throw new Error("Failed to find a user.");
    }

    // check if contact is present
    const checkContact = await ContactUs.findById(req.params.id);
    if (!checkContact) {
      res.status(404);
      throw new Error("contact not found");
    }

    // create a pending req to accept
    let pendingData = {
      modelId: checkContact._id,
      modelName: "ContactUs",
      action: "Delete",
    };
    let notificationMsg = {
      name: `${checkUser.full_name} wants to delete contact`,
      marathi: { message: "!" },
      english: { message: "!" },
    };
    await createPending(pendingData, notificationMsg, res);

    res.status(204).json({
      message: "Contact delete request forwaded!",
      data: {},
      success: true,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server Error: " + error);
  }
});

module.exports = {
  createContact,
  getContact,
  getContacts,
  updateContact,
  deleteContact,
};
