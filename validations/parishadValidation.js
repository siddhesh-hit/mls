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

// create VidhanParishad validation
const createVidhanParishadValidation = (data) => {
  const schema = joi.object({
    marathi: joi.object({
      description: joi.string().required(),
      legislative_council: joi.array().items({
        council_name: joi.string().required(),
        council_description: joi.string().required(),
      }),
    }),
    english: joi.object({
      description: joi.string().required(),
      legislative_council: joi.array().items({
        council_name: joi.string().required(),
        council_description: joi.string().required(),
      }),
    }),
    banner_image: imageValidation.required(),
    legislative_council: joi.array().items({
      council_profile: imageValidation.required(),
    }),
  });
  return schema.validate(data);
};

// update VidhanParishad validation
const updateVidhanParishadValidation = (data) => {
  const schema = joi.object({
    marathi: joi.object({
      description: joi.string().required(),
      legislative_council: joi.array().items({
        council_name: joi.string().required(),
        council_description: joi.string().required(),
      }),
    }),
    english: joi.object({
      description: joi.string().required(),
      legislative_council: joi.array().items({
        council_name: joi.string().required(),
        council_description: joi.string().required(),
      }),
    }),
    banner_image: imageValidation.required(),
    legislative_council: joi.array().items({
      council_profile: imageValidation.required(),
    }),
  });
  return schema.validate(data);
};

module.exports = {
  createVidhanParishadValidation,
  updateVidhanParishadValidation,
};
