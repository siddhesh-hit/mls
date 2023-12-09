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

// create member Legislative validation
const createMemberValidation = (data) => {
  const schema = joi.object({
    basic_info: joi
      .object({
        house: joi.string().required(),
        profile: imageValidation.required(),
        name: joi.string().required(),
        surname: joi.string().required(),
        constituency: joi.string().required(),
        party: joi.string().required(),
        gender: joi.string().required(),
        district: joi.string().required(),
        first_time_elected: joi.string().required(),
        date_of_birth: joi.string().required(),
        place_of_birth: joi.string().required(),
        education: joi.string().required(),
        language: joi.string().required(),
        marital_status: joi.string().required(),
        children: joi.string().required(),
        business: joi.string().required(),
        hobby: joi.string().required(),
        foreign_migration: joi.string().required(),
        address: joi.string().required(),
        mobile_number: joi.string().required(),
        email: joi.string().required(),
      })
      .unknown(true),
    political_journey: joi.array().items(
      joi.object({
        date: joi.string().required(),
        title: joi.string().required(),
      })
    ),
    election_data: joi.object({
      constituency: joi.string().required(),
      total_electorate: joi.string().required(),
      total_valid_voting: joi.string().required(),
      member_election_result: joi.array().items(
        joi.object({
          candidate_name: joi.string().required(),
          votes: joi.string().required(),
          party: joi.string().required(),
        })
      ),
    }),
  });

  return schema.validate(data);
};

// update member Legislative validation
const updateMemberValidation = (data) => {
  const schema = joi.object({
    basic_info: joi
      .object({
        house: joi.string().required(),
        profile: imageValidation.required(),
        name: joi.string().required(),
        surname: joi.string().required(),
        constituency: joi.string().required(),
        party: joi.string().required(),
        gender: joi.string().required(),
        district: joi.string().required(),
        first_time_elected: joi.string().required(),
        date_of_birth: joi.string().required(),
        place_of_birth: joi.string().required(),
        education: joi.string().required(),
        language: joi.string().required(),
        marital_status: joi.string().required(),
        children: joi.string().required(),
        business: joi.string().required(),
        hobby: joi.string().required(),
        foreign_migration: joi.string().required(),
        address: joi.string().required(),
        mobile_number: joi.string().required(),
        email: joi.string().required(),
      })
      .unknown(true),

    political_journey: joi.array().items(
      joi
        .object({
          date: joi.string().required(),
          title: joi.string().required(),
          _id: joi.any(),
        })
        .unknown(true)
    ),
    election_data: joi.object({
      constituency: joi.string().required(),
      total_electorate: joi.string().required(),
      total_valid_voting: joi.string().required(),
      member_election_result: joi.array().items(
        joi
          .object({
            candidate_name: joi.string().required(),
            votes: joi.string().required(),
            party: joi.string().required(),
            _id: joi.any(),
          })
          .unknown(true)
      ),
    }),
  });

  return schema.validate(data);
};

module.exports = {
  createMemberValidation,
  updateMemberValidation,
};
