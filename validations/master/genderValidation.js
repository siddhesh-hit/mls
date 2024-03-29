const joi = require("joi");

// create an Gender validation
const createGenderValidation = (data) => {
  const schema = joi.array().items(
    joi.object({
      marathi: joi.object({
        gender: joi.string().required().label("Marathi Gender is required."),
      }),
      english: joi.object({
        gender: joi.string().required().label("English Gender is required."),
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
        gender: joi.string().required().label("Marathi Gender is required."),
      }),
      english: joi.object({
        gender: joi.string().required().label("English Gender is required."),
      }),
    })
    .unknown(true);

  return schema.validate(data);
};

module.exports = {
  createGenderValidation,
  updateGenderValidation,
};
