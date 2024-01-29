const joi = require("joi");

// create an Navigation validation
const createNavigationValidation = (data) => {
  const schema = data.isDropDown
    ? joi.array().items(
        joi.object({
          marathi: joi.object({
            navigation: joi.string().required(),
            dropDownValue: joi.array().items(
              joi.object({
                name: joi.string().required(),
              })
            ),
          }),
          english: joi.object({
            navigation: joi.string().required(),
            dropDownValue: joi.array().items(
              joi.object({
                name: joi.string().required(),
              })
            ),
          }),
          isDropDown: joi.boolean().required(),
        })
      )
    : joi.array().items(
        joi.object({
          marathi: joi.object({
            navigation: joi.string().required(),
          }),
          english: joi.object({
            navigation: joi.string().required(),
          }),
          isDropDown: joi.boolean().required(),
        })
      );

  return schema.validate(data);
};

// update an Navigation validation
const updateNavigationValidation = (data) => {
  const schema = data.isDropDown
    ? joi
        .object({
          marathi: joi
            .object({
              navigation: joi.string().required(),
              dropDownValue: joi.array().items(
                joi
                  .object({
                    name: joi.string().required(),
                  })
                  .unknown(true)
              ),
            })
            .unknown(true),
          english: joi
            .object({
              navigation: joi.string().required(),
              dropDownValue: joi.array().items(
                joi
                  .object({
                    name: joi.string().required(),
                  })
                  .unknown(true)
              ),
            })
            .unknown(true),
          isDropDown: joi.boolean().required(),
          isActive: joi.boolean().required(),
          isAccepted: joi.boolean().required(),
          isUpdated: joi.boolean().required(),
        })
        .unknown(true)
    : joi
        .object({
          marathi: joi
            .object({
              navigation: joi.string().required(),
            })
            .unknown(true),
          english: joi
            .object({
              navigation: joi.string().required(),
            })
            .unknown(true),
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
