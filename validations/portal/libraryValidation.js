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
      description: joi
        .string()
        .required()
        .label("Marathi Description is required"),
    }),
    english: joi.object({
      description: joi
        .string()
        .required()
        .label("English Description is required"),
    }),
    banner: imageValidation.required().label("Image is required"),
  });

  return schema.validate(data);
};

// update library validation
const updateLibraryValidation = (data) => {
  const schema = joi
    .object({
      marathi: joi.object({
        description: joi
          .string()
          .required()
          .label("Marathi Description is required"),
      }),
      english: joi.object({
        description: joi
          .string()
          .required()
          .label("English Description is required"),
      }),
      banner: imageValidation.required().label("Image is required"),
    })
    .unknown(true);

  return schema.validate(data);
};

module.exports = {
  createLibraryValidation,
  updateLibraryValidation,
};
