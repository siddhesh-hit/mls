const joi = require("joi");

// image validation
const imageValidation = joi
  .object({
    fieldname: joi.string().required(),
    originalname: joi.string().required(),
    encoding: joi.string().required(),
    mimetype: joi.string().required(),
    destination: joi.string().required(),
    filename: joi.string().required(),
    path: joi.string().required(),
    size: joi.number().required(),
    _id: joi.any().optional(),
  })
  .unknown(true);

// create library validation
const createLibraryValidation = (data) => {
  const schema = joi.object({
    marathi: joi.object({
      description: joi.string().required(),
    }),
    english: joi.object({
      description: joi.string().required(),
    }),
    banner: imageValidation.required(),
  });

  return schema.validate(data);
};

// update library validation
const updateLibraryValidation = (data) => {
  const schema = joi.object({
    marathi: joi.object({
      description: joi.string().required(),
    }),
    english: joi.object({
      description: joi.string().required(),
    }),
    banner: imageValidation,
  });

  return schema.validate(data);
};

module.exports = {
  createLibraryValidation,
  updateLibraryValidation,
};
