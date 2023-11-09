const mongoose = require("mongoose");

const refreshToken = new mongoose.Schema({
  refreshToken: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const RefreshToken = mongoose.model("RefreshToken", refreshToken);

module.exports = RefreshToken;
