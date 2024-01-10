const joi = require("joi");

// image validation
const imageValidation = joi.object({
  fieldname: joi.string(),
  originalname: joi.string(),
  encoding: joi.string(),
  mimetype: joi.string(),
  destination: joi.string(),
  filename: joi.string(),
  path: joi.string(),
  size: joi.number(),
  _id: joi.any().optional(),
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
    houses: joi.string(),
    department: joi.string(),
    password: joi.string().min(6).required(),
    phone_number: joi.string().required(),
    gender: joi.string().required(),
    date_of_birth: joi.date().required(),
    designation: joi.string(),
    user_image: imageValidation.optional(),
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

// update user validation
const updateUserValidate = (data) => {
  const schema = joi
    .object({
      full_name: joi.string().min(6).required(),
      email: joi.string().min(6).required().email(),
      houses: joi.string(),
      department: joi.string(),
      phone_number: joi.string().required(),
      gender: joi.string().required(),
      date_of_birth: joi.date().required(),
      designation: joi.string(),
      user_image: imageValidation.required(),
    })
    .unknown(true);

  return schema.validate(data);
};

module.exports = {
  registerPhoneValidate,
  registerEmailValidate,
  loginPhoneValidate,
  loginEmailValidate,
  updateUserValidate,
};
