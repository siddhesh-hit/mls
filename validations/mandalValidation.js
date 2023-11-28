const joi = require("joi");

// image validation
const imageValidation = joi.object({
  fieldname: joi.string().required(),
  originalname: joi.string().required(),
  encoding: joi.string().required(),
  mimetype: joi.string().required(),
  destination: joi.string().required(),
  filename: joi.string().required(),
  path: joi.string().required(),
  size: joi.number().required(),
});

// create Vidhanmandal validation
const createVidhanMandalValidation = (data) => {
  const schema = joi.object({
    marathi: joi.object({
      about_us: joi
        .array()
        .items(
          joi.object({
            title: joi.string().required(),
            description: joi.string().required(),
          })
        )
        .required(),
    }),
    english: joi.object({
      about_us: joi
        .array()
        .items(
          joi.object({
            title: joi.string().required(),
            description: joi.string().required(),
          })
        )
        .required(),
    }),
    mandal_image: joi
      .array()
      .items(
        joi.object({
          image: imageValidation.required(),
          documents: imageValidation.required(),
        })
      )
      .required(),
  });

  return schema.validate(data);
};

// update Vidhanmandal validation
const updateVidhanMandalValidation = (data) => {};

module.exports = {
  createVidhanMandalValidation,
  updateVidhanMandalValidation,
};
