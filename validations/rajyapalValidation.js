const joi = require("joi");

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

// create a rajyapal member
const createRajyapalMemberValidation = (data) => {
  const schema = joi.object({
    marathi: joi.object({
      name: joi.string().required(),
      elected_date: joi.string().required(),
      gender: joi.string().required(),
      place_of_birth: joi.string().required(),
      political_career: joi.string().required(),
    }),
    english: joi.object({
      name: joi.string().required(),
      elected_date: joi.string().required(),
      gender: joi.string().required(),
      place_of_birth: joi.string().required(),
      political_career: joi.string().required(),
    }),
    image: imageValidation.required(),
    url: joi.string().required(),
    speeches: joi.array().items(
      joi.object({
        year: joi.string().required(),
        values: joi.array().items(
          joi.object({
            language: joi.string().required(),
            content: imageValidation.required(),
          })
        ),
      })
    ),
  });

  return schema.validate(data);
};

// update a rajyapal member
const updateRajyapalMemberValidation = (data) => {};

module.exports = {
  createRajyapalMemberValidation,
  updateRajyapalMemberValidation,
};
