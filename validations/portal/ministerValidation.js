const joi = require("joi");

// Create a new Minister validation
const createMinisterValidation = (data) => {
  const schema = joi.object({
    ministry_type: joi.string().required().label("Ministry type is required"),
    assembly_number: joi
      .string()
      .required()
      .label("Assembly number is required"),
    member_name: joi.string().required().label("Member name is required"),
    designation: joi.string().required().label("Designation is required"),
    ministry: joi.string().required().label("Ministry is required"),
  });
  return schema.validate(data);
};

// Update a Minister validation
const updateMinisterValidation = (data) => {
  const schema = joi
    .object({
      assembly_number: joi
        .string()
        .required()
        .label("Assembly number is required"),
      ministry_type: joi.string().required().label("Ministry type is required"),
      member_name: joi.string().required().label("Member name is required"),
      designation: joi.string().required().label("Designation is required"),
      ministry: joi.string().required().label("Ministry is required"),
      _id: joi.any().optional(),
      isActive: joi.boolean().required(),
      isAccepted: joi.boolean().required(),
      isUpdated: joi.boolean().required(),
    })
    .unknown(true);
  return schema.validate(data);
};

module.exports = {
  createMinisterValidation,
  updateMinisterValidation,
};