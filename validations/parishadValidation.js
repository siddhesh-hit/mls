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

// create VidhanParishad validation
const createVidhanParishadValidation = (data) => {
  const schema = joi.object({
    marathi: joi.object({
      title: joi.string().required(),
      banner_image: imageValidation.required(),
      description: joi.string().required(),
      // banner_image: joi.string().required(),
      // topics: joi.array().items({
      //   title: joi.string().required(),
      //   session: joi.array().items({
      //     content: joi.array().items({
      //       content_name: joi.string().required(),
      //       content_document: joi.string().required(),
      //       content_createdAt: joi.date(),
      //     }),
      //   }),
      // }),
      legislative_council: joi.array().items({
        council_profile: imageValidation.required(),
        council_name: joi.string().required(),
        council_description: joi.string().required(),
      }),
    }),
    english: joi.object({
      title: joi.string().required(),
      banner_image: image.required(),
      description: joi.string().required(),
      // banner_image: joi.string().required(),
      // topics: joi.array().items({
      //   title: joi.string().required(),
      //   session: joi.array().items({
      //     content: joi.array().items({
      //       content_name: joi.string().required(),
      //       content_document: joi.string().required(),
      //       content_createdAt: joi.date(),
      //     }),
      //   }),
      // }),
      legislative_council: joi.array().items({
        council_profile: imageValidation.required(),
        council_name: joi.string().required(),
        council_description: joi.string().required(),
      }),
    }),
  });
  return schema.validate(data);
};

// update VidhanParishad validation
const updateVidhanParishadValidation = (data) => {
  const schema = joi.object({
    marathi: joi.object({
      title: joi.string().required(),
      banner_image: image.required(),
      description: joi.string().required(),
      // banner_image: joi.string().required(),
      // topics: joi.array().items({
      //   title: joi.string().required(),
      //   session: joi.array().items({
      //     content: joi.array().items({
      //       content_name: joi.string().required(),
      //       content_document: joi.string().required(),
      //       content_createdAt: joi.date(),
      //     }),
      //   }),
      // }),
      legislative_council: joi.array().items({
        council_profile: imageValidation.required(),
        council_name: joi.string().required(),
        council_description: joi.string().required(),
      }),
    }),
    english: joi.object({
      title: joi.string().required(),
      banner_image: image.required(),
      description: joi.string().required(),
      // banner_image: joi.string().required(),
      // topics: joi.array().items({
      //   title: joi.string().required(),
      //   session: joi.array().items({
      //     content: joi.array().items({
      //       content_name: joi.string().required(),
      //       content_document: joi.string().required(),
      //       content_createdAt: joi.date(),
      //     }),
      //   }),
      // }),
      legislative_council: joi.array().items({
        council_profile: imageValidation.required(),
        council_name: joi.string().required(),
        council_description: joi.string().required(),
      }),
    }),
  });
  return schema.validate(data);
};

module.exports = {
  createVidhanParishadValidation,
  updateVidhanParishadValidation,
};
