const joi = require("joi");

// create a schema for the memberGraph model
const createMemberGraphSchema = (data) => {
  const schema = joi.object({
    marathi: joi.object({
      partyRuling: joi.array().items(
        joi.object({
          partyName: joi
            .string()
            .required()
            .label("Marathi Party name is required"),
          partyMember: joi
            .number()
            .required()
            .label("Marathi Party member is required"),
        })
      ),
      partyOpposition: joi.array().items(
        joi.object({
          partyName: joi
            .string()
            .required()
            .label("Marathi Party name is required"),
          partyMember: joi
            .number()
            .required()
            .label("Marathi Party member is required"),
        })
      ),
      partyOther: joi.array().items(
        joi.object({
          partyName: joi
            .string()
            .required()
            .label("Marathi Party name is required"),
          partyMember: joi
            .number()
            .required()
            .label("Marathi Party member is required"),
        })
      ),
      partyVacant: joi.array().items(
        joi.object({
          partyName: joi.string().required().label("Party name is required"),
          partyMember: joi
            .number()
            .required()
            .label("Marathi Party member is required"),
        })
      ),
    }),
    english: joi.object({
      partyRuling: joi.array().items(
        joi.object({
          partyName: joi
            .string()
            .required()
            .label("English Party name is required"),
          partyMember: joi
            .number()
            .required()
            .label("English Party member is required"),
        })
      ),
      partyOpposition: joi.array().items(
        joi.object({
          partyName: joi
            .string()
            .required()
            .label("English Party name is required"),
          partyMember: joi
            .number()
            .required()
            .label("English Party member is required"),
        })
      ),
      partyOther: joi.array().items(
        joi.object({
          partyName: joi
            .string()
            .required()
            .label("English Party name is required"),
          partyMember: joi
            .number()
            .required()
            .label("English Party member is required"),
        })
      ),
      partyVacant: joi.array().items(
        joi.object({
          partyName: joi
            .string()
            .required()
            .label("English Party name is required"),
          partyMember: joi
            .number()
            .required()
            .label("English Party member is required"),
        })
      ),
    }),
  });

  return schema.validate(data);
};

// update a schema for the memberGraph model
const updateMemberGraphSchema = (data) => {
  const schema = joi.object({
    marathi: joi.object({
      partyRuling: joi.array().items(
        joi
          .object({
            partyName: joi
              .string()
              .required()
              .label("Marathi Party name is required"),
            partyMember: joi
              .number()
              .required()
              .label("Marathi Party member is required"),
            _id: joi.any().optional(),
          })
          .optional()
      ),
      partyOpposition: joi.array().items(
        joi
          .object({
            partyName: joi
              .string()
              .required()
              .label("Marathi Party name is required"),
            partyMember: joi
              .number()
              .required()
              .label("Marathi Party member is required"),
            _id: joi.any().optional(),
          })
          .optional()
      ),
      partyOther: joi.array().items(
        joi
          .object({
            partyName: joi
              .string()
              .required()
              .label("Marathi Party name is required"),
            partyMember: joi
              .number()
              .required()
              .label("Marathi Party member is required"),
            _id: joi.any().optional(),
          })
          .optional()
      ),
      partyVacant: joi.array().items(
        joi
          .object({
            partyName: joi
              .string()
              .required()
              .label("Marathi Party name is required"),
            partyMember: joi
              .number()
              .required()
              .label("Marathi Party member is required"),
            _id: joi.any().optional(),
          })
          .optional()
      ),
    }),
    english: joi.object({
      partyRuling: joi.array().items(
        joi
          .object({
            partyName: joi
              .string()
              .required()
              .label("English Party name is required"),
            partyMember: joi
              .number()
              .required()
              .label("English Party member is required"),
            _id: joi.any().optional(),
          })
          .optional()
      ),
      partyOpposition: joi.array().items(
        joi
          .object({
            partyName: joi
              .string()
              .required()
              .label("English Party name is required"),
            partyMember: joi
              .number()
              .required()
              .label("English Party member is required"),
            _id: joi.any().optional(),
          })
          .optional()
      ),
      partyOther: joi.array().items(
        joi
          .object({
            partyName: joi
              .string()
              .required()
              .label("English Party name is required"),
            partyMember: joi
              .number()
              .required()
              .label("English Party member is required"),
            _id: joi.any().optional(),
          })
          .optional()
      ),
      partyVacant: joi.array().items(
        joi
          .object({
            partyName: joi
              .string()
              .required()
              .label("English Party name is required"),
            partyMember: joi
              .number()
              .required()
              .label("English Party member is required"),
            _id: joi.any().optional(),
          })
          .optional()
      ),
    }),
  });

  return schema.validate(data);
};

module.exports = {
  createMemberGraphSchema,
  updateMemberGraphSchema,
};
