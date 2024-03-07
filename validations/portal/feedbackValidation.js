const joi = require("joi");

// create feedback validation
const createFeedbackValidation = (data) => {
  const schema = joi.object({
    full_name: joi.string().required().label("First name is required"),
    email: joi.string().required().label("Email is required"),
    subject: joi.string().required().label("Subject is required"),
    feedback: joi.string().required().label("Feedback is required"),
  });

  return schema.validate(data);
};

// update feedback validation
const updateFeedbackValidation = (data) => {
  const schema = joi
    .object({
      full_name: joi.string().required().label("First name is required"),
      email: joi.string().required().label("Email is required"),
      subject: joi.string().required().label("Subject is required"),
      feedback: joi.string().required().label("Feedback is required"),
      _id: joi.string().optional(),
    })
    .unknown(true);

  return schema.validate(data);
};

module.exports = {
  createFeedbackValidation,
  updateFeedbackValidation,
};
