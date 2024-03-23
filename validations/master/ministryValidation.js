const joi = require("joi");

// create an Ministry validation
const createMinistryValidation = (data) => {
  const schema = joi.object({
    ministry_name: joi.string().required().label("Ministry name is required!"),
    minister: joi.string().required().label("Minister is required!"),
    year: joi.date().required().label("Year is required!"),
    sub_ministry: joi.array().items(
      joi.object({
        name: joi.string().required().label("Name is required!"),
        minister: joi
          .string()
          .required()
          .label("Minister for sub is required!"),
      })
    ),
    createdBy: joi.string().required().label("Created user is required"),
  });
  return schema.validate(data);
};

// update an Ministry validation
const updateMinistryValidation = (data) => {
  const schema = joi
    .object({
      ministry_name: joi
        .string()
        .required()
        .label("Ministry name is required!"),
      minister: joi.string().required().label("Minister is required!"),
      year: joi.date().required().label("Year is required!"),
      sub_ministry: joi.array().items(
        joi
          .object({
            name: joi.string().required().label("Name is required!"),
            minister: joi
              .string()
              .required()
              .label("Minister for sub is required!"),
          })
          .unknown(true)
      ),
      isActive: joi.boolean().required().label("Active status required!"),
      status: joi.string().required().label("Status is required!"),
      createdBy: joi.string().required().label("Created user is required"),
      updatedBy: joi.string().required().label("Updated user is required"),
    })
    .unknown(true);

  return schema.validate(data);
};

module.exports = {
  createMinistryValidation,
  updateMinistryValidation,
};
