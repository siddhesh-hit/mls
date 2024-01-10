const joi = require("joi");

// create an Navigation validation
const createNavigationValidation = (data) => {
  const schema = joi.array().items(
    joi.object({
      navigation: joi.string().required(),
      dropDownValue: joi.array().items(
        joi.object({
          name: joi.string().required(),
        })
      ),
      isDropDown: joi.boolean().required(),
    })
  );

  return schema.validate(data);
};

// update an Navigation validation
const updateNavigationValidation = (data) => {
  const schema = joi
    .object({
      navigation: joi.string().required(),
      dropDownValue: joi.array().items(
        joi.object({
          name: joi.string().required(),
        })
      ),
      isDropDown: joi.boolean().required(),
      isActive: joi.boolean().required(),
      isAccepted: joi.boolean().required(),
      isUpdated: joi.boolean().required(),
    })
    .unknown(true);

  return schema.validate(data);
};

module.exports = {
  createNavigationValidation,
  updateNavigationValidation,
};
