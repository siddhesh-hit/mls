const joi = require("joi");

// create a helpdesk validation
const createHelpDeskValidation = (data) => {
  const schema = joi.object({
    full_name: joi.string().required(),
    email: joi.string().required(),
    phone_number: joi.string().required(),
    address: joi.string().required(),
    feedback: joi.string().required(),
  });

  return schema.validate(data);
};

// update a helpdesk validation
const updateHelpDeskValidation = (data) => {
  const schema = joi.object({
    full_name: joi.string().required(),
    email: joi.string().required(),
    phone_number: joi.string().required(),
    address: joi.string().required(),
    feedback: joi.string().required(),
  });

  return schema.validate(data);
};

module.exports = {
  createHelpDeskValidation,
  updateHelpDeskValidation,
};
