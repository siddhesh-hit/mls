const joi = require("joi");

// create an District validation
const createDistrictValidation = (data) => {
  const schema = joi.array().items(
    joi.object({
      marathi: joi.object({
        district: joi
          .string()
          .required()
          .label("Marathi District is required."),
      }),
      english: joi.object({
        district: joi
          .string()
          .required()
          .label("English District is required."),
      }),
    })
  );

  return schema.validate(data);
};

// update an District validation
const updateDistrictValidation = (data) => {
  const schema = joi
    .object({
      marathi: joi.object({
        district: joi
          .string()
          .required()
          .label("Marathi District is required."),
      }),
      english: joi.object({
        district: joi
          .string()
          .required()
          .label("English District is required."),
      }),
      isActive: joi.boolean().required(),
      isAccepted: joi.boolean().required(),
      isUpdated: joi.boolean().required(),
    })
    .unknown(true);

  return schema.validate(data);
};

module.exports = {
  createDistrictValidation,
  updateDistrictValidation,
};
