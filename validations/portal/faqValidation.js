const joi = require("joi");

// Create a new FAQ validation
const createFAQValidation = (data) => {
  const schema = joi.object({
    english: joi.object({
      question: joi.string().required().label("Question is required"),
      answer: joi.string().required().label("Answer is required"),
    }),
    marathi: joi.object({
      question: joi.string().required().label("Question is required"),
      answer: joi.string().required().label("Answer is required"),
    }),
    createdBy: joi.string().required().label("Created by is required"),
  });
  return schema.validate(data);
};

// Update a FAQ validation
const updateFAQValidation = (data) => {
  const schema = joi
    .object({
      english: joi
        .object({
          question: joi.string().required().label("Question is required"),
          answer: joi.string().required().label("Answer is required"),
          _id: joi.any().optional(),
        })
        .optional(),
      marathi: joi
        .object({
          question: joi.string().required().label("Question is required"),
          answer: joi.string().required().label("Answer is required"),
          _id: joi.any().optional(),
        })
        .optional(),
      createdBy: joi.string().required().label("Created by is required"),
      updatedBy: joi.string().required().label("Updated by is required"),
    })
    .unknown(true);
  return schema.validate(data);
};

module.exports = {
  createFAQValidation,
  updateFAQValidation,
};
