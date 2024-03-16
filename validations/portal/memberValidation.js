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
        house: joi.string().required().label("House is required."),
        profile: imageValidation.required().label("Profile is required."),
        name: joi.string().required().label("Name is required."),
        surname: joi.string().required().label("Surname is required."),
        constituency: joi
          .string()
          .required()
          .label("Constituency is required."),
        // constituency_from: joi
        //   .string()
        //   .required()
        //   .label("Constituency from is required."),
        // constituency_to: joi
        //   .string()
        //   .required()
        //   .label("Constituency to is required."),
        party: joi.string().required().label("Party is required."),
        gender: joi.string().required().label("Gender is required."),
        district: joi.string().required().label("District is required."),
        first_time_elected: joi
          .string()
          .required()
          .label("First time elected is required."),
        date_of_birth: joi
          .string()
          .required()
          .label("Date of birth is required."),
        place_of_birth: joi
          .string()
          .required()
          .label("Place of birth is required."),
        education: joi.string().required().label("Education is required."),
        language: joi.string().required().label("Language is required."),
        marital_status: joi
          .string()
          .required()
          .label("Marital Status is required."),
        children: joi.string().required().label("Children is required."),
        business: joi.string().required().label("Business is required."),
        hobby: joi.string().required().label("Hobby is required."),
        foreign_migration: joi
          .string()
          .required()
          .label("Foreign Migration is required."),
        address: joi.string().required().label("Address is required."),
        address1: joi.string().required().label("Address 1 is required."),
        mobile_number: joi
          .string()
          .required()
          .label("Mobile number is required."),
        email: joi.string().required().label("Email is required."),
      })
      .unknown(true),
    political_journey: joi.array().items(
      joi
        .object({
          date: joi.date().required().label("Date is required."),
          title: joi.string().required().label("Title is required."),
          presiding: joi
            .string()
            .allow("", null)
            .required()
            .label("Presiding Officer is required."),
          legislative_position: joi
            .string()
            .allow("", null)
            .required()
            .label("Legislative Position is required."),
          designation: joi
            .string()
            .allow("", null)
            .required()
            .label("Designation is required."),
        })
        .unknown(true)
    ),
    election_data: joi.object({
      constituency: joi
        .string()
        .allow("", null)
        .required()
        .label("Constituency is required."),
      total_electorate: joi
        .string()
        .required()
        .label("Total electorate is required."),
      total_valid_voting: joi
        .string()
        .required()
        .label("Total valid voting is required."),
      member_election_result: joi.array().items(
        joi.object({
          candidate_name: joi
            .string()
            .required()
            .label("Candidate name is required."),
          votes: joi.string().required().label("Votes is required."),
          party: joi
            .string()
            .allow("", null)
            .required()
            .label("Party is required."),
        })
      ),
    }),
    createdBy: joi.string().required().label("Created by is required"),
  });

  return schema.validate(data);
};

// update member Legislative validation
const updateMemberValidation = (data) => {
  const schema = joi.object({
    basic_info: joi
      .object({
        house: joi.string().required().label("House is required."),
        profile: imageValidation.required().label("Profile is required."),
        name: joi.string().required().label("Name is required."),
        surname: joi.string().required().label("Surname is required."),
        // constituency: joi
        //   .string()
        //   .required()
        //   .label("Constituency is required."),
        // constituency_from: joi
        //   .string()
        //   .required()
        //   .label("Constituency from is required."),
        // constituency_to: joi
        //   .string()
        //   .required()
        //   .label("Constituency to is required."),
        party: joi
          .string()
          .allow("", null)
          .required()
          .label("Party is required."),
        gender: joi
          .string()
          .allow("", null)
          .required()
          .label("Gender is required."),
        district: joi
          .string()
          .allow("", null)
          .required()
          .label("District is required."),
        first_time_elected: joi
          .string()
          .required()
          .label("First time elected is required."),
        date_of_birth: joi
          .string()
          .required()
          .label("Date of birth is required."),
        place_of_birth: joi
          .string()
          .required()
          .label("Place of birth is required."),
        education: joi.string().required().label("Education is required."),
        language: joi.string().required().label("Language is required."),
        marital_status: joi
          .string()
          .required()
          .label("Marital Status is required."),
        // constituency_from: joi
        //   .string()
        //   .required()
        //   .label("Constituency from is required."),
        // constituency_to: joi
        //   .string()
        //   .required()
        //   .label("Constituency to is required."),
        children: joi.string().required().label("Children is required."),
        business: joi.string().required().label("Business is required."),
        hobby: joi.string().required().label("Hobby is required."),
        foreign_migration: joi
          .string()
          .required()
          .label("Foreign Migration is required."),
        address: joi.string().required().label("Address is required."),
        address1: joi.string().required().label("Address 1 is required."),
        mobile_number: joi
          .string()
          .required()
          .label("Mobile number is required."),
        email: joi.string().required().label("Email is required."),
        awards: joi.string().required().label("Awards is required."),
        other_info: joi.string().required().label("Other Info is required."),
      })
      .unknown(true),

    political_journey: joi.array().items(
      joi
        .object({
          date: joi.date().required().label("Date is required."),
          title: joi.string().required().label("Title is required."),
          _id: joi.any(),
          presiding: joi
            .string()
            .allow("", null)
            .required()
            .label("Presiding Officer is required."),
          legislative_position: joi
            .string()
            .allow("", null)
            .required()
            .label("Legislative Position is required."),
          designation: joi
            .string()
            .allow("", null)
            .required()
            .label("Designation is required."),
        })
        .unknown(true)
    ),
    election_data: joi.object({
      // constituency: joi.string().required().label("Constituency is required."),
      total_electorate: joi
        .string()
        .required()
        .label("Total electorate is required."),
      total_valid_voting: joi
        .string()
        .required()
        .label("Total valid voting is required."),
      member_election_result: joi.array().items(
        joi
          .object({
            candidate_name: joi
              .string()
              .required()
              .label("Candidate name is required."),
            votes: joi.string().required().label("Votes is required."),
            party: joi
              .string()
              .allow("", null)
              .required()
              .label("Party is required."),
          })
          .unknown(true)
      ),
    }),
    createdBy: joi.string().optional().label("Created by is required"),
    updatedBy: joi.string().optional().label("Updated by is required"),
  });

  return schema.validate(data);
};

module.exports = {
  createMemberValidation,
  updateMemberValidation,
};
