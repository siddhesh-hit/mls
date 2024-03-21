const joi = require("joi");

// Create a new Minister validation
const createMinisterValidation = (data) => {
  const schema = joi.object({
    assembly_number: joi
      .string()
      .required()
      .label("Assembly number is required"),
    member_name: joi.string().required().label("Member name is required"),
    ministry_type: joi
      .array()
      .items()
      .required()
      .label("Ministry type is required"),
    designation: joi
      .array()
      .items()
      .required()
      .label("Designation is required"),
    des_from: joi.date().required().label("Designation from is required"),
    des_to: joi.date().required().label("Designation to is required"),
    presiding: joi
      .array()
      .items()
      .required()
      .label("Presiding type is required"),
    pres_from: joi.date().required().label("Presiding from is required"),
    pres_to: joi.date().required().label("Presiding to is required"),
    legislative_position: joi
      .array()
      .items()
      .required()
      .label("Legislative Position is required"),
    lp_from: joi
      .date()
      .required()
      .label("Legislation Positon fron is required"),
    lp_to: joi.date().required().label("Legislation Positon to is required"),
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
      member_name: joi.string().required().label("Member name is required"),
      ministry_type: joi
        .array()
        .items()
        .required()
        .label("Ministry type is required"),
      designation: joi
        .array()
        .items()
        .required()
        .label("Designation is required"),
      des_from: joi.date().required().label("Designation from is required"),
      des_to: joi.date().required().label("Designation to is required"),
      presiding: joi
        .array()
        .items()
        .required()
        .label("Presiding type is required"),
      pres_from: joi.date().required().label("Presiding from is required"),
      pres_to: joi.date().required().label("Presiding to is required"),
      legislative_position: joi
        .array()
        .items()
        .required()
        .label("Legislative Position is required"),
      lp_from: joi
        .date()
        .required()
        .label("Legislation Positon fron is required"),
      lp_to: joi.date().required().label("Legislation Positon to is required"),
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
