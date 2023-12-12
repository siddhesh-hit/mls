const joi = require("joi");

// create an assembly validation
const createAssemblyValidation = (data) => {
  const schema = joi.array().items(
    joi.object({
      marathi: joi.object({
        assembly_number: joi.string().required(),
        assembly_name: joi.string().required(),
      }),
      english: joi.object({
        assembly_number: joi.string().required(),
        assembly_name: joi.string().required(),
      }),
      start_date: joi.date().required(),
      end_date: joi.date().required(),
      current_assembly: joi.string().required(),
      // isActive: joi.boolean().required(),
      // isAccepted: joi.boolean().required(),
      // isUpdated: joi.boolean().required(),
    })
  );

  return schema.validate(data);
};

// update an assembly validation
const updateAssemblyValidation = (data) => {
  const schema = joi
    .object({
      marathi: joi
        .object({
          assembly_number: joi.string().required(),
          assembly_name: joi.string().required(),
        })
        .unknown(true),
      english: joi
        .object({
          assembly_number: joi.string().required(),
          assembly_name: joi.string().required(),
        })
        .unknown(true),
      start_date: joi.date().required(),
      end_date: joi.date().required(),
      current_assembly: joi.string().required(),
      isActive: joi.boolean().required(),
      isAccepted: joi.boolean().required(),
      isUpdated: joi.boolean().required(),
    })
    .unknown(true);

  return schema.validate(data);
};

module.exports = {
  createAssemblyValidation,
  updateAssemblyValidation,
};
