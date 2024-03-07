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

// create Vidhanmandal validation
const createVidhanMandalValidation = (data) => {
  const schema = joi.object({
    marathi: joi.object({
      about_us: joi
        .array()
        .items(
          joi.object({
            title: joi.string().required().label("Marathi Title is required."),
            description: joi
              .string()
              .required()
              .label("Marathi Description is required."),
          })
        )
        .required(),
    }),
    english: joi.object({
      about_us: joi
        .array()
        .items(
          joi.object({
            title: joi.string().required().label("English Title is required."),
            description: joi
              .string()
              .required()
              .label("English Description is required."),
          })
        )
        .required(),
    }),
    mandal_image: joi
      .array()
      .items(
        joi.object({
          image: imageValidation.required().label("Image is required."),
          documents: imageValidation.required().label("Documents is required."),
        })
      )
      .required(),

    createdBy: joi.string().required().label("Created by is required"),
  });

  return schema.validate(data);
};

// update Vidhanmandal validation
const updateVidhanMandalValidation = (data) => {};

module.exports = {
  createVidhanMandalValidation,
  updateVidhanMandalValidation,
};
