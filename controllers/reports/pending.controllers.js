const { default: mongoose } = require("mongoose");
const asyncHandler = require("express-async-handler");

const Pending = require("../../models/reports/Pending");
const User = require("../../models/portals/userModel");
const ResetHead = require("../../models/reports/ResetHead");
const Notification = require("../../models/extras/Notification");

const { createResetHead } = require("./resethead.controllers");
const { createArchive } = require("./archive.controllers");

// @desc    Create a Pending
// @route   POST /api/pending/
// @access  ContentCreator
const createPending = asyncHandler(async (data, notificationMsg, res) => {
  try {
    if (!data.modelId || !data.modelName || !data.action) {
      res.status(400);
      throw new Error("Fill each fields properly");
    }

    const pending = await Pending.create(data);
    if (!pending) {
      res.status(400);
      throw new Error("Failed to create a pending entry.");
    }

    let allUsers = await User.find()
      .populate("notificationId")
      .populate("role_taskId");

    await Promise.all(
      allUsers.map(async (item) => {
        if (
          item.user_verfied &&
          (item.role_taskId.role === "SuperAdmin" ||
            item.role_taskId.role === "ContentCreator")
        ) {
          const checkNotify = await Notification.findById(
            item.notificationId._id
          );
          if (!checkNotify) {
            res.status(400);
            throw new Error("No notification found");
          }

          checkNotify.user_specific.push(notificationMsg);
          await checkNotify.save();
        }
      })
    );

    return {
      success: true,
      data: pending,
      message: "Pending entry registered successfully.",
    };
  } catch (error) {
    res.status(500);
    throw new Error("Server error: " + error);
  }
});

// @desc    Get all entries
// @route   GET /api/pending/
// @access  SuperAdmin, Reviewer
const getAllRequest = asyncHandler(async (req, res) => {
  try {
    let { perPage, perLimit, ...id } = req.query;
    const pageOptions = {
      page: parseInt(perPage, 10) || 0,
      limit: parseInt(perLimit, 10) || 10,
    };

    let matchedQuery = {};

    if (id.isPending) {
      matchedQuery["isPending"] = true;
    }
    if (id.action) {
      matchedQuery["action"] = { $eq: id.action };
    }
    if (id.modelName) {
      matchedQuery["modelName"] = new RegExp(`.*${id.modelName}.*`, "i");
    }

    console.log(matchedQuery);

    let pending = await Pending.aggregate([
      {
        $match: matchedQuery,
      },
      {
        $facet: {
          pending: [
            { $sort: { createdAt: -1 } },
            { $skip: pageOptions.page * pageOptions.limit },
            { $limit: pageOptions.limit },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    if (!pending) {
      res.status(400);
      throw new Error("No pending entries found.");
    }

    res.status(200).json({
      success: true,
      data: pending[0].pending || [],
      count: pending[0].totalCount[0]?.count || 0,
      message: "Pending entries fetched successfully.",
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server error: " + error);
  }
});

// @desc    Get one Pending entries
// @route   GET /api/pending/:id
// @access  SuperAdmin, Reviewer
const getSingleRequest = asyncHandler(async (req, res) => {
  try {
    let pending = await Pending.findById(req.params.id);

    if (!pending) {
      res.status(400);
      throw new Error("No pending entry found for provided id.");
    }

    res.status(200).json({
      success: true,
      data: pending,
      message: "Pending entry fetched successfully.",
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server error: " + error);
  }
});

// @desc    Update one create Pending entry
// @route   PUT /api/pending/updatePost/:id
// @access  SuperAdmin, Reviewer
const updatePendingCreate = asyncHandler(async (req, res) => {
  try {
    let data = req.body;

    if (data.action !== "Create") {
      res.status(400);
      throw new Error(
        "The pending request action is not CREATE, check proper route for specific actions."
      );
    }

    let userId = res.locals.userInfo;
    let modelName = data.modelName;
    let modelId = data.modelId;

    data.approved_by = userId.id;
    // console.log(data);

    if (
      !data.modelId ||
      !data.modelName ||
      !data.approved_by ||
      !data.status ||
      !data.action
    ) {
      res.status(400);
      throw new Error("Fill each fields properly");
    }

    // check if request exists
    const pending = await Pending.findById(req.params.id);
    if (!pending) {
      res.status(400);
      throw new Error("No pending entry found for provided id.");
    }

    // Retrieve the Mongoose model dynamically
    const Model = mongoose.model(modelName);

    // check if model with model id exists
    const checkModelExists = await Model.findById(modelId);
    if (!checkModelExists) {
      res.status(400);
      throw new Error("No model entry found for provided id.");
    }

    // check if user exists who's approving it
    let checkUser = await User.findById(data.approved_by)
      .populate("notificationId")
      .populate("role_taskId");
    if (!checkUser) {
      res.status(400);
      throw new Error("No user found for provided id.");
    }

    // if the request is approved or rejected
    let updatedPending, updateModelStatus, notificationMsg;
    if (data.status === "Accepted") {
      // update the model status
      checkModelExists.status = "Approved";

      // update the request
      data.isPending = false;
      updatedPending = await Pending.findByIdAndUpdate(req.params.id, data, {
        runValidators: true,
        new: true,
      });
      if (!updatedPending) {
        res.status(400);
        throw new Error("Failed to update the request.");
      }

      updateModelStatus = await Model.findByIdAndUpdate(
        modelId,
        checkModelExists,
        { runValidators: true, new: true }
      );

      notificationMsg = {
        name: `FAQ updated by ${checkUser.full_name}`,
        marathi: { message: "!" },
        english: { message: "!" },
      };
    } else {
      // update the model status
      checkModelExists.status = "Rejected";

      // update the request
      data.isPending = false;
      updatedPending = await Pending.findByIdAndUpdate(req.params.id, data, {
        runValidators: true,
        new: true,
      });
      if (!updatedPending) {
        res.status(400);
        throw new Error("Failed to update the request.");
      }

      // create the entry in archive for backup
      let dataForArchive = {
        data_object: checkModelExists,
        operation_by: userId.id,
        modelName,
        modelId,
        state: "UpdateRejected",
        action: "Create",
      };

      let addInArchive = await createArchive(dataForArchive, res);

      // check if created or not
      if (!addInArchive.success) {
        res.status(400);
        throw new Error("Failed to create an archive copy for provided model.");
      }

      updateModelStatus = await Model.findByIdAndDelete(modelId);
      notificationMsg = {
        name: `FAQ rejected by ${checkUser.full_name}`,
        marathi: { message: "!" },
        english: { message: "!" },
      };
    }

    // send notification to SuperAdmin & ContentCreator about the request
    let allUsers = await User.find()
      .populate("notificationId")
      .populate("role_taskId");
    // console.log(allUsers);
    // console.log(allUsers);

    await Promise.all(
      allUsers.map(async (item) => {
        if (
          item.user_verfied &&
          (item.role_taskId.role === "SuperAdmin" ||
            item.role_taskId.role === "ContentCreator")
        ) {
          const checkNotify = await Notification.findById(
            item.notificationId._id
          );
          if (!checkNotify) {
            res.status(400);
            throw new Error("No notification found");
          }

          checkNotify.user_specific.push(notificationMsg);
          await checkNotify.save();
        }
      })
    );

    res.status(200).json({
      success: true,
      data: { updatedPending, updateModelStatus },
      message: "Pending entry for create request updated successfully.",
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server error: " + error);
  }
});

// @desc    Update one update Pending entry
// @route   PUT /api/pending/updatePut/:id
// @access  SuperAdmin, Reviewer
const updatePendingUpdate = asyncHandler(async (req, res) => {
  try {
    let data = req.body;

    if (data.action !== "Update") {
      res.status(400);
      throw new Error(
        "The pending request action is not UPDATE, check proper route for specific actions."
      );
    }

    let userId = res.locals.userInfo;
    let modelName = data.modelName;
    let modelId = data.modelId;

    data.approved_by = userId.id;
    // console.log(data);

    if (
      !data.modelId ||
      !data.modelName ||
      !data.approved_by ||
      !data.status ||
      !data.action ||
      !data.data_object
    ) {
      res.status(400);
      throw new Error("Fill each fields properly");
    }

    // check if request exists
    const pending = await Pending.findById(req.params.id);
    if (!pending) {
      res.status(400);
      throw new Error("No pending entry found for provided id.");
    }

    // Retrieve the Mongoose model dynamically
    const Model = mongoose.model(modelName);

    if (modelName === "Member") {
      if (data.data_object.basic_info.assembly_number === "") {
        data.data_object.basic_info.assembly_number = null;
      }
    }

    console.log(data);

    // check if model with model id exists
    const checkModelExists = await Model.findById(modelId);
    if (!checkModelExists) {
      res.status(400);
      throw new Error("No model entry found for provided id.");
    }

    // check if user exists who's approving it
    let checkUser = await User.findById(data.approved_by)
      .populate("notificationId")
      .populate("role_taskId");
    if (!checkUser) {
      res.status(400);
      throw new Error("No user found for provided id.");
    }

    // if the request is approved or rejected
    let updatedPending, updateModelStatus, notificationMsg;
    if (data.status === "Accepted") {
      // update the request
      data.isPending = false;
      updatedPending = await Pending.findByIdAndUpdate(req.params.id, data, {
        runValidators: true,
        new: true,
      });
      if (!updatedPending) {
        res.status(400);
        throw new Error("Failed to update the request.");
      }

      // create an entry in resetHead for backup/reverse action
      let dataForReset = {
        data_object: checkModelExists,
        operation_by: userId.id,
        modelName,
        modelId,
        action: data.action,
      };

      let addInReset = await createResetHead(dataForReset, res);

      // check if created or not
      if (!addInReset.success) {
        res.status(400);
        throw new Error("Failed to create a reset copy for provided model.");
      }

      // update the model requested
      updateModelStatus = await Model.findByIdAndUpdate(
        modelId,
        data.data_object,
        { runValidators: true, new: true }
      );

      notificationMsg = {
        name: `FAQ updated by ${checkUser.full_name}`,
        marathi: { message: "!" },
        english: { message: "!" },
      };
    } else {
      // update the request
      data.isPending = false;
      updatedPending = await Pending.findByIdAndUpdate(req.params.id, data, {
        runValidators: true,
        new: true,
      });
      if (!updatedPending) {
        res.status(400);
        throw new Error("Failed to update the request.");
      }

      // create an archive entry for backup
      let dataForArchive = {
        data_object: data.data_object,
        operation_by: userId.id,
        modelName,
        modelId,
        action: data.action,
        state: "UpdateRejected",
      };

      let addInArchive = await createArchive(dataForArchive, res);

      // check if created or not
      if (!addInArchive.success) {
        res.status(400);
        throw new Error("Failed to create an archive copy for provided model.");
      }

      notificationMsg = {
        name: `FAQ rejected by ${checkUser.full_name}`,
        marathi: { message: "!" },
        english: { message: "!" },
      };
    }

    // send notification to SuperAdmin & ContentCreator about the request
    let allUsers = await User.find()
      .populate("notificationId")
      .populate("role_taskId");
    // console.log(allUsers);
    // console.log(allUsers);

    await Promise.all(
      allUsers.map(async (item) => {
        if (
          item.user_verfied &&
          (item.role_taskId.role === "SuperAdmin" ||
            item.role_taskId.role === "ContentCreator")
        ) {
          const checkNotify = await Notification.findById(
            item.notificationId._id
          );
          if (!checkNotify) {
            res.status(400);
            throw new Error("No notification found");
          }

          checkNotify.user_specific.push(notificationMsg);
          await checkNotify.save();
        }
      })
    );

    res.status(200).json({
      success: true,
      data: updatedPending,
      message: "Pending entry for update request updated successfully.",
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server error: " + error);
  }
});

// @desc    Update one delete Pending entry
// @route   PUT /api/pending/updateDel/:id
// @access  SuperAdmin, Reviewer
const updatePendingDelete = asyncHandler(async (req, res) => {
  try {
    let data = req.body;

    if (data.action !== "Delete") {
      res.status(400);
      throw new Error(
        "The pending request action is not DELETE, check proper route for specific actions."
      );
    }

    let userId = res.locals.userInfo;
    let modelName = data.modelName;
    let modelId = data.modelId;

    data.approved_by = userId.id;
    // console.log(data);

    if (
      !data.modelId ||
      !data.modelName ||
      !data.approved_by ||
      !data.status ||
      !data.action
    ) {
      res.status(400);
      throw new Error("Fill each fields properly");
    }

    // check if request exists
    const pending = await Pending.findById(req.params.id);
    if (!pending) {
      res.status(400);
      throw new Error("No pending entry found for provided id.");
    }

    // Retrieve the Mongoose model dynamically
    const Model = mongoose.model(modelName);

    // check if model with model id exists
    const checkModelExists = await Model.findById(modelId);
    if (!checkModelExists) {
      res.status(400);
      throw new Error("No model entry found for provided id.");
    }

    // check if user exists who's approving it
    let checkUser = await User.findById(data.approved_by)
      .populate("notificationId")
      .populate("role_taskId");
    if (!checkUser) {
      res.status(400);
      throw new Error("No user found for provided id.");
    }

    // if the request is approved or rejected
    let updatedPending, updateModelStatus, notificationMsg;
    if (data.status === "Accepted") {
      // updat the status
      checkModelExists.status = "Approved";

      // update the request
      data.isPending = false;
      updatedPending = await Pending.findByIdAndUpdate(req.params.id, data, {
        runValidators: true,
        new: true,
      });
      if (!updatedPending) {
        res.status(400);
        throw new Error("Failed to update the request.");
      }

      // create an entry in resetHead for backup/reverse action
      let dataForReset = {
        data_object: checkModelExists,
        operation_by: userId.id,
        modelName,
        modelId,
        action: data.action,
      };

      let addInReset = await createResetHead(dataForReset, res);

      // check if created or not
      if (!addInReset.success) {
        res.status(400);
        throw new Error("Failed to create a reset copy for provided model.");
      }

      updateModelStatus = await Model.findByIdAndDelete(modelId);
      notificationMsg = {
        name: `FAQ updated by ${checkUser.full_name}`,
        marathi: { message: "!" },
        english: { message: "!" },
      };
    } else {
      // update the request
      data.isPending = false;
      updatedPending = await Pending.findByIdAndUpdate(req.params.id, data, {
        runValidators: true,
        new: true,
      });
      if (!updatedPending) {
        res.status(400);
        throw new Error("Failed to update the request.");
      }

      // checkModelExists.status = "Rejected";
      // updateModelStatus = await Model.findByIdAndUpdate(
      //   modelId,
      //   checkModelExists,
      //   { runValidators: true, new: true }
      // );
      notificationMsg = {
        name: `FAQ rejected by ${checkUser.full_name}`,
        marathi: { message: "!" },
        english: { message: "!" },
      };
    }

    // send notification to SuperAdmin & ContentCreator about the request
    let allUsers = await User.find()
      .populate("notificationId")
      .populate("role_taskId");
    // console.log(allUsers);
    // console.log(allUsers);

    await Promise.all(
      allUsers.map(async (item) => {
        if (
          item.user_verfied &&
          (item.role_taskId.role === "SuperAdmin" ||
            item.role_taskId.role === "ContentCreator")
        ) {
          const checkNotify = await Notification.findById(
            item.notificationId._id
          );
          if (!checkNotify) {
            res.status(400);
            throw new Error("No notification found");
          }

          checkNotify.user_specific.push(notificationMsg);
          await checkNotify.save();
        }
      })
    );

    res.status(200).json({
      success: true,
      data: updatedPending,
      message: "Pending entry for delete request updated successfully.",
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server error: " + error);
  }
});

// @desc    Delete one Pending entries
// @route   DELETE /api/pending/:id
// @access  SuperAdmin, Reviewer
const deletePending = asyncHandler(async (req, res) => {
  try {
    let pending = await Pending.findByIdAndDelete(req.params.id);

    if (!pending) {
      res.status(400);
      throw new Error("No pending entry found for provided id.");
    }

    res.status(204).json({
      success: true,
      data: {},
      message: "Pending entry deleted successfully.",
    });
  } catch (error) {
    res.status(500);
    throw new Error("Server error: " + error);
  }
});

module.exports = {
  createPending,
  getAllRequest,
  getSingleRequest,
  updatePendingCreate,
  updatePendingUpdate,
  updatePendingDelete,
  deletePending,
};
