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

// validate user register using phone
const registerPhoneValidate = (data) => {
  const schema = joi.object({
    phone_number: joi.string().min(10).required(),
  });
  return schema.validate(data);
};

// validate user register using email
const registerEmailValidate = (data) => {
  const schema = joi.object({
    full_name: joi.string().min(6).required(),
    email: joi.string().min(6).required().email(),
    password: joi.string().min(6).required(),
    phone_number: joi.string().required(),
    gender: joi.string().required(),
    date_of_birth: joi.date().required(),
    user_type: joi.string().required(),
    user_image: imageValidation.required(),
  });
  return schema.validate(data);
};

// validate user login using phone
const loginPhoneValidate = (data) => {
  const schema = joi.object({
    phone_number: joi.string().min(10).required(),
    password: joi.string().min(6).required(),
  });
  return schema.validate(data);
};

// validate user login using email
const loginEmailValidate = (data) => {
  const schema = joi.object({
    email: joi.string().min(6).required().email(),
    password: joi.string().min(6).required(),
  });
  return schema.validate(data);
};

module.exports = {
  registerPhoneValidate,
  registerEmailValidate,
  loginPhoneValidate,
  loginEmailValidate,
};
