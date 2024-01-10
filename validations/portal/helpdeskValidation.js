const joi = require("joi");

// create a helpdesk validation
const createHelpDeskValidation = (data) => {
  const schema = joi.object({
    full_name: joi.string().required().label("First name is required"),
    email: joi.string().required().label("Email is required"),
    phone_number: joi.string().required().label("Phone number is required"),
    address: joi.string().required().label("Address is required"),
    feedback: joi.string().required().label("Feedback is required"),
  });

  return schema.validate(data);
};

// update a helpdesk validation
const updateHelpDeskValidation = (data) => {
  const schema = joi
    .object({
      full_name: joi.string().required().label("First name is required"),
      email: joi.string().required().label("Email is required"),
      phone_number: joi.string().required().label("Phone number is required"),
      address: joi.string().required().label("Address is required"),
      feedback: joi.string().required().label("Feedback is required"),
      _id: joi.any().optional(),
    })
    .unknown(true);

  return schema.validate(data);
};

module.exports = {
  createHelpDeskValidation,
  updateHelpDeskValidation,
};
