// calling libraries
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// schema design
const userModel = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      minlength: 5,
      maxlength: 100,
    },
    password: {
      type: String,
      minlength: 5,
      maxlength: 100,
    },
    phone_number: {
      type: String,
      unique: true,
      minlength: 5,
      maxlength: 25,
    },
    user_role: {
      type: String,
      required: true,
      enum: ["Admin", "Super Admin", "Manager", "User"],
      default: "User",
    },
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
