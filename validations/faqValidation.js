const joi = require("joi");

// Create a new FAQ validation
const createFAQValidation = (data) => {
  const schema = joi.array().items(
    joi.object({
      english: joi
        .object({
          question: joi.string().required(),
          answer: joi.string().required(),
          _id: joi.any().optional(),
        })
        .optional(),
      marathi: joi
        .object({
          question: joi.string().required(),
          answer: joi.string().required(),
          _id: joi.any().optional(),
        })
        .optional(),
    })
  );
  return schema.validate(data);
};

// Update a FAQ validation
const updateFAQValidation = (data) => {
  const schema = joi.object({
    english: joi
      .object({
        question: joi.string().required(),
        answer: joi.string().required(),
        _id: joi.any().optional(),
      })
      .optional(),
    marathi: joi
      .object({
        question: joi.string().required(),
        answer: joi.string().required(),
        _id: joi.any().optional(),
      })
      .optional(),
  });
  return schema.validate(data);
};

module.exports = {
  createFAQValidation,
  updateFAQValidation,
};
