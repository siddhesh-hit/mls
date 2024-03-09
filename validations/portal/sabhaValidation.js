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

// create vidhanSabha validation
const createVidhanSabhaValidation = (data) => {
  const schema = joi.object({
    marathi: joi.object({
      description: joi
        .string()
        .required()
        .label("Marathi Description is required."),
      legislative_council: joi.array().items({
        council_name: joi
          .string()
          .required()
          .label("Marathi Council name is required."),
        council_description: joi
          .string()
          .required()
          .label("Marathi Council description is required."),
      }),
      structure: joi.object({
        name: joi.string().required().label("Name description is required."),
        type: joi.string().required().label("Type description is required."),
        term_limit: joi
          .string()
          .required()
          .label("Term limit description is required."),
        seats: joi.string().required().label("Seats description is required."),
      }),
    }),
    english: joi.object({
      description: joi
        .string()
        .required()
        .label("English Description is required."),
      legislative_council: joi.array().items({
        council_name: joi
          .string()
          .required()
          .label("English Council name is required."),
        council_description: joi
          .string()
          .required()
          .label("English Council description is required."),
      }),
      structure: joi.object({
        name: joi.string().required().label("Name description is required."),
        type: joi.string().required().label("Type description is required."),
        term_limit: joi
          .string()
          .required()
          .label("Term limit description is required."),
        seats: joi.string().required().label("Seats description is required."),
      }),
    }),
    structure_profile: imageValidation
      .required()
      .label("structure profile is required"),
    banner_image: imageValidation.required().label("banner image is required"),
    legislative_council: joi.array().items({
      council_profile: imageValidation
        .required()
        .label("Council profile is required"),
    }),
    publication: joi.array().items(
      joi.object({
        english: joi.object({
          name: joi.string().required().label("Name is required"),
          document: imageValidation.required().label("Document is required"),
        }),
        marathi: joi.object({
          name: joi.string().required().label("Name is required"),
          document: imageValidation.required().label("Document is required"),
        }),
      })
    ),
    createdBy: joi.string().required().label("Created by is required"),
  });
  return schema.validate(data);
};

// update vidhanSabha validation
const updateVidhanSabhaValidation = (data) => {
  const schema = joi
    .object({
      marathi: joi.object({
        description: joi
          .string()
          .required()
          .label("Marathi Description is required."),
        legislative_council: joi.array().items(
          joi
            .object({
              _id: joi.any().optional(),
              council_name: joi
                .string()
                .required()
                .label("Marathi Council name is required."),
              council_description: joi
                .string()
                .required()
                .label("Marathi Council description is required."),
            })
            .unknown(true)
        ),
        structure: joi
          .object({
            _id: joi.any().optional(),
            name: joi
              .string()
              .required()
              .label("Name description is required."),
            type: joi
              .string()
              .required()
              .label("Type description is required."),
            term_limit: joi
              .string()
              .required()
              .label("Term limit description is required."),
            seats: joi
              .string()
              .required()
              .label("Seats description is required."),
          })
          .unknown(true),
      }),
      english: joi.object({
        description: joi
          .string()
          .required()
          .label("English Description is required."),
        legislative_council: joi.array().items(
          joi
            .object({
              _id: joi.any().optional(),
              council_name: joi
                .string()
                .required()
                .label("English Council name is required."),
              council_description: joi
                .string()
                .required()
                .label("English Council description is required."),
            })
            .unknown(true)
        ),
        structure: joi
          .object({
            _id: joi.any().optional(),
            name: joi
              .string()
              .required()
              .label("Name description is required."),
            type: joi
              .string()
              .required()
              .label("Type description is required."),
            term_limit: joi
              .string()
              .required()
              .label("Term limit description is required."),
            seats: joi
              .string()
              .required()
              .label("Seats description is required."),
          })
          .unknown(true),
      }),
      structure_profile: imageValidation
        .required()
        .label("structure profile is required"),
      banner_image: imageValidation
        .required()
        .label("banner image is required"),
      legislative_council: joi.array().items(
        joi
          .object({
            _id: joi.any().optional(),
            council_profile: imageValidation
              .required()
              .label("Council profile is required"),
          })
          .unknown(true)
      ),
      publication: joi.array().items(
        joi
          .object({
            english: joi.object({
              name: joi.string().required().label("Name is required"),
              document: imageValidation
                .required()
                .label("Document is required"),
              _id: joi.any().optional(),
            }),
            marathi: joi.object({
              name: joi.string().required().label("Name is required"),
              document: imageValidation
                .required()
                .label("Document is required"),
              _id: joi.any().optional(),
            }),
          })
          .unknown(true)
      ),
      createdBy: joi.string().optional().label("Created by is required"),
      updatedBy: joi.string().optional().label("Updated by is required"),
    })
    .unknown(true);
  return schema.validate(data);
};

module.exports = {
  createVidhanSabhaValidation,
  updateVidhanSabhaValidation,
};
