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
      name: joi.string().required().label("Marathi name is required"),
      elected_date: joi
        .string()
        .required()
        .label("Marathi Elected date name is required"),
      gender: joi.string().required().label("Marathi Gender name is required"),
      place_of_birth: joi
        .string()
        .required()
        .label("Marathi Place of birth name is required"),
      political_career: joi
        .string()
        .required()
        .label("Marathi Political  name is required"),
    }),
    english: joi.object({
      name: joi.string().required().label("English  name is required"),
      elected_date: joi
        .string()
        .required()
        .label("English Elected date name is required"),
      gender: joi.string().required().label("English Gender name is required"),
      place_of_birth: joi
        .string()
        .required()
        .label("English Place of birth name is required"),
      political_career: joi
        .string()
        .required()
        .label("English Political  name is required"),
    }),
    image: imageValidation.required().label("Image is required"),
    url: joi.string().required().label("URL is required"),
    speeches: joi.array().items(
      joi.object({
        year: joi.string().required().label("Year is required."),
        values: joi.array().items(
          joi.object({
            language: joi.string().required().label("Language is required."),
            content: imageValidation.required().label("Content is required."),
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
