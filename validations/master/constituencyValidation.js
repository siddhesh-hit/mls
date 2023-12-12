const joi = require("joi");

// create an Constituency validation
const createConstituencyValidation = (data) => {
  const schema = joi.array().items(
    joi.object({
      marathi: joi.object({
        constituency_assembly: joi.string().required(),
        assembly_number: joi.string().required(),
      }),
      english: joi.object({
        constituency_assembly: joi.string().required(),
        assembly_number: joi.string().required(),
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
        assembly_number: joi.string().required(),
        constituency_assembly: joi.string().required(),
      }),
      english: joi.object({
        assembly_number: joi.string().required(),
        constituency_assembly: joi.string().required(),
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
