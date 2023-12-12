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

// create an Party validation
const createPartyValidation = (data) => {
  const schema = joi.array().items(
    joi.object({
      marathi: joi.object({
        party_name: joi.string().required(),
        short_name: joi.string().required(),
      }),
      english: joi
        .object({
          party_name: joi.string().required(),
          short_name: joi.string().required(),
        })
        .unknown(true),
      party_flag: imageValidation.required(),
      party_symbol: imageValidation.required(),
    })
  );
  console.log(data);
  return schema.validate(data);
};

// update an Party validation
const updatePartyValidation = (data) => {
  const schema = joi
    .object({
      marathi: joi.object({
        party_name: joi.string().required(),
        short_name: joi.string().required(),
      }),
      english: joi.object({
        party_name: joi.string().required(),
        short_name: joi.string().required(),
      }),
      party_flag: imageValidation.required(),
      party_symbol: imageValidation.required(),
      isActive: joi.boolean().required(),
      isAccepted: joi.boolean().required(),
      isUpdated: joi.boolean().required(),
    })
    .unknown(true);
  // console.log(data);
  return schema.validate(data);
};

module.exports = {
  createPartyValidation,
  updatePartyValidation,
};
