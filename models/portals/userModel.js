// calling libraries
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const imageSchema = require("./imageSchema");

// schema design
const userModel = new mongoose.Schema(
  {
    full_name: {
      type: String,
    },
    houses: {
      type: String,
      default: "Public User",
    },
    department: {
      type: String,
      default: "Public User",
    },
    designation: {
      type: String,
      default: "Public User",
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
    },
    phone_number: {
      type: String,
      unique: true,
      sparse: true,
    },
    gender: {
      type: String,
    },
    date_of_birth: {
      type: Date,
    },
    user_image: imageSchema,
    phone_otp: {
      type: String,
    },
    email_otp: {
      type: String,
    },
    user_verfied: {
      type: Boolean,
      default: false,
    },
    notificationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notification",
    },
    role_taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role_Task",
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
userModel.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userModel.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userModel);

module.exports = User;
