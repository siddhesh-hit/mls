const joi = require("joi");

// create feedback validation
const createFeedbackValidation = (data) => {
  const schema = joi.object({
    full_name: joi.string().required(),
    email: joi.string().required(),
    feedback: joi.string().required(),
  });

  return schema.validate(data);
};

// update feedback validation
const updateFeedbackValidation = (data) => {
  const schema = joi.object({
    full_name: joi.string().required(),
    email: joi.string().required(),
    feedback: joi.string().required(),
    _id: joi.string().optional(),
  });

  return schema.validate(data);
};

module.exports = {
  createFeedbackValidation,
  updateFeedbackValidation,
};
