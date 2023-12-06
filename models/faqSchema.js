const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    marathi: {
      question: {
        type: String,
        required: true,
      },
      answer: {
        type: String,
        required: true,
      },
    },
    english: {
      question: {
        type: String,
        required: true,
      },
      answer: {
        type: String,
        required: true,
      },
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Faq = mongoose.model("Faq", faqSchema);

module.exports = Faq;
