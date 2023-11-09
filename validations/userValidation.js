const joi = require("joi");

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
    email: joi.string().min(6).required().email(),
    password: joi.string().min(6).required(),
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
