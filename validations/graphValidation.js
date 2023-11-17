const joi = require("joi");

// create a schema for the memberGraph model
const createMemberGraphSchema = (data) => {
  const schema = joi.object({
    marathi: joi.object({
      partyRuling: joi.array().items(
        joi.object({
          partyName: joi.string().required(),
          partyMember: joi.number().required(),
        })
      ),
      partyOpposition: joi.array().items(
        joi.object({
          partyName: joi.string().required(),
          partyMember: joi.number().required(),
        })
      ),
      partyOther: joi.array().items(
        joi.object({
          partyName: joi.string().required(),
          partyMember: joi.number().required(),
        })
      ),
      partyVacant: joi.array().items(
        joi.object({
          partyName: joi.string().required(),
          partyMember: joi.number().required(),
        })
      ),
    }),
    english: joi.object({
      partyRuling: joi.array().items(
        joi.object({
          partyName: joi.string().required(),
          partyMember: joi.number().required(),
        })
      ),
      partyOpposition: joi.array().items(
        joi.object({
          partyName: joi.string().required(),
          partyMember: joi.number().required(),
        })
      ),
      partyOther: joi.array().items(
        joi.object({
          partyName: joi.string().required(),
          partyMember: joi.number().required(),
        })
      ),
      partyVacant: joi.array().items(
        joi.object({
          partyName: joi.string().required(),
          partyMember: joi.number().required(),
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
        joi.object({
          partyName: joi.string().required(),
          partyMember: joi.number().required(),
        })
      ),
      partyOpposition: joi.array().items(
        joi.object({
          partyName: joi.string().required(),
          partyMember: joi.number().required(),
        })
      ),
      partyOther: joi.array().items(
        joi.object({
          partyName: joi.string().required(),
          partyMember: joi.number().required(),
        })
      ),
      partyVacant: joi.array().items(
        joi.object({
          partyName: joi.string().required(),
          partyMember: joi.number().required(),
        })
      ),
    }),
    english: joi.object({
      partyRuling: joi.array().items(
        joi.object({
          partyName: joi.string().required(),
          partyMember: joi.number().required(),
        })
      ),
      partyOpposition: joi.array().items(
        joi.object({
          partyName: joi.string().required(),
          partyMember: joi.number().required(),
        })
      ),
      partyOther: joi.array().items(
        joi.object({
          partyName: joi.string().required(),
          partyMember: joi.number().required(),
        })
      ),
      partyVacant: joi.array().items(
        joi.object({
          partyName: joi.string().required(),
          partyMember: joi.number().required(),
        })
      ),
    }),
  });

  return schema.validate(data);
};

module.exports = {
  createMemberGraphSchema,
  updateMemberGraphSchema,
};
