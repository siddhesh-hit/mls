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
    designation: joi
      .array()
      .items()
      .required()
      .label("Designation is required"),
    year: joi.string().required().label("Year is required"),
    createdBy: joi.string().required().label("Created by is required"),
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
      designation: joi
        .array()
        .items()
        .required()
        .label("Designation is required"),
      year: joi.string().required().label("Year is required"),
      _id: joi.any().optional(),
      isActive: joi.boolean().required(),
      createdBy: joi.string().optional().label("Created by is required"),
      updatedBy: joi.string().optional().label("Updated by is required"),
    })
    .unknown(true);
  return schema.validate(data);
};

module.exports = {
  createMinisterValidation,
  updateMinisterValidation,
};
