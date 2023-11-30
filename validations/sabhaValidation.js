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

// create vidhanSabha validation
const createVidhanSabhaValidation = (data) => {
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

// update vidhanSabha validation
const updateVidhanSabhaValidation = (data) => {
  const schema = joi.object({
    marathi: joi.object({
      description: joi.string().required(),
      legislative_council: joi.array().items(
        joi
          .object({
            _id: joi.any().optional(),
            council_name: joi.string().required(),
            council_description: joi.string().required(),
          })
          .unknown(true)
      ),
    }),
    english: joi.object({
      description: joi.string().required(),
      legislative_council: joi.array().items(
        joi
          .object({
            _id: joi.any().optional(),
            council_name: joi.string().required(),
            council_description: joi.string().required(),
          })
          .unknown(true)
      ),
    }),
    banner_image: imageValidation.required(),
    legislative_council: joi.array().items(
      joi
        .object({
          _id: joi.any().optional(),
          council_profile: imageValidation.required(),
        })
        .unknown(true)
    ),
  });
  return schema.validate(data);
};

module.exports = {
  createVidhanSabhaValidation,
  updateVidhanSabhaValidation,
};
