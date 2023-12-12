const joi = require("joi");

// create an Gender validation
const createGenderValidation = (data) => {
  const schema = joi.array().items(
    joi.object({
      marathi: joi.object({
        gender: joi.string().required(),
      }),
      english: joi.object({
        gender: joi.string().required(),
      }),
    })
  );

  return schema.validate(data);
};

// update an Gender validation
const updateGenderValidation = (data) => {
  const schema = joi
    .object({
      marathi: joi.object({
        gender: joi.string().required(),
      }),
      english: joi.object({
        gender: joi.string().required(),
      }),
      isActive: joi.boolean().required(),
      isAccepted: joi.boolean().required(),
      isUpdated: joi.boolean().required(),
    })
    .unknown(true);

  return schema.validate(data);
};

module.exports = {
  createGenderValidation,
  updateGenderValidation,
};
