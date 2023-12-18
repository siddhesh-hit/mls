const joi = require("joi");

// create an Constituency validation
const createConstituencyValidation = (data) => {
  const schema = joi.array().items(
    joi.object({
      marathi: joi.object({
        constituency_assembly: joi
          .string()
          .required()
          .label("Marathi Constituency Assembly is required."),
        assembly_number: joi
          .string()
          .required()
          .label("Marathi Assembly Number is required."),
      }),
      english: joi.object({
        constituency_assembly: joi
          .string()
          .required()
          .label("English Constituency Assembly is required."),
        assembly_number: joi
          .string()
          .required()
          .label("English Assembly Number is required."),
      }),
      // isActive: joi.boolean().required(),
      // isAccepted: joi.boolean().required(),
      // isUpdated: joi.boolean().required(),
    })
  );

  return schema.validate(data);
};

// update an Constituency validation
const updateConstituencyValidation = (data) => {
  const schema = joi
    .object({
      marathi: joi.object({
        constituency_assembly: joi
          .string()
          .required()
          .label("Marathi Constituency Assembly is required."),
        assembly_number: joi
          .string()
          .required()
          .label("Marathi Assembly Number is required."),
      }),
      english: joi.object({
        constituency_assembly: joi
          .string()
          .required()
          .label("English Constituency Assembly is required."),
        assembly_number: joi
          .string()
          .required()
          .label("English Assembly Number is required."),
      }),
      isActive: joi.boolean().required(),
      isAccepted: joi.boolean().required(),
      isUpdated: joi.boolean().required(),
    })
    .unknown(true);

  return schema.validate(data);
};

module.exports = {
  createConstituencyValidation,
  updateConstituencyValidation,
};
