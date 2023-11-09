const mongoose = require("mongoose");

const vidhanSabhaSchema = new mongoose.Schema({
  structure: {
    type: String,
    required: true,
  },
  vidhan_parishad_details: {
    type: String,
    required: true,
  },
  apeal_letter: {
    type: String,
    required: true,
  },
  notification: {
    type: String,
    required: true,
  },
  calender_of_meeting: {
    type: String,
    required: true,
  },
  proceeding_convention: {
    type: String,
    required: true,
  },
  serial_numbers: {
    type: String,
    required: true,
  },
  lists_of_questions: {
    type: String,
    required: true,
  },
});

const VidhanSabha = mongoose.model("VidhanSabha", vidhanSabhaSchema);

module.exports = VidhanSabha;
