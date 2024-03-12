const joi = require("joi");

// create an Constituency validation
const createConstituencyValidation = (data) => {
  const schema = joi.object({
    marathi: joi.object({
      assembly: joi
        .object({
          constituency_assembly: joi
            .string()
            .required()
            .label("Marathi Constituency Assembly is required."),
          assembly_number: joi
            .string()
            .required()
            .label("Marathi Assembly Number is required."),
          year: joi.string().required().label("Marathi Year is required."),
        })
        .optional(),
      council: joi
        .object({
          constituency_type: joi
            .string()
            .required()
            .label("Marathi Constituency type is required."),
          constituency_name: joi
            .string()
            .required()
            .label("Marathi Constituency name is required."),
          year: joi.string().required().label("Marathi Year is required."),
        })
        .optional(),
    }),
    english: joi.object({
      assembly: joi.object({
        constituency_assembly: joi
          .string()
          .required()
          .label("English Constituency Assembly is required."),
        assembly_number: joi
          .string()
          .required()
          .label("English Assembly Number is required."),
        year: joi.string().required().label("English Year is required."),
      }),
      council: joi.object({
        constituency_type: joi
          .string()
          .required()
          .label("English Constituency type is required."),
        constituency_name: joi
          .string()
          .required()
          .label("English Constituency name is required."),
        year: joi.string().required().label("English Year is required."),
      }),
    }),
    // isActive: joi.boolean().required(),
    // isAccepted: joi.boolean().required(),
    // isUpdated: joi.boolean().required(),
  });
  return schema.validate(data);
};

// update an Constituency validation
const updateConstituencyValidation = (data) => {
  const schema = joi
    .object({
      assembly: joi
        .object({
          constituency_assembly: joi
            .string()
            .required()
            .label("Marathi Constituency Assembly is required."),
          assembly_number: joi
            .string()
            .required()
            .label("Marathi Assembly Number is required."),
          year: joi.string().required().label("Marathi Year is required."),
        })
        .optional(),
      council: joi
        .object({
          constituency_type: joi
            .string()
            .required()
            .label("Marathi Constituency type is required."),
          constituency_name: joi
            .string()
            .required()
            .label("Marathi Constituency name is required."),
          year: joi.string().required().label("Marathi Year is required."),
        })
        .optional(),
    })
    .unknown(true);

  return schema.validate(data);
};

module.exports = {
  createConstituencyValidation,
  updateConstituencyValidation,
};
