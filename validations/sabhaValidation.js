const joi = require("joi");

// create vidhanSabha validation
const createVidhanSabhaValidation = (data) => {
  const schema = joi.object({
    marathi: joi.object({
      title: joi.string().required(),
      banner_image: joi
        .object({
          fieldname: joi.string().required(),
          originalname: joi.string().required(),
          encoding: joi.string().required(),
          mimetype: joi.string().required(),
          destination: joi.string().required(),
          filename: joi.string().required(),
          path: joi.string().required(),
          size: joi.number().required(),
        })
        .required(),
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
        council_profile: joi
          .object({
            fieldname: joi.string().required(),
            originalname: joi.string().required(),
            encoding: joi.string().required(),
            mimetype: joi.string().required(),
            destination: joi.string().required(),
            filename: joi.string().required(),
            path: joi.string().required(),
            size: joi.number().required(),
          })
          .required(),
        council_name: joi.string().required(),
        council_description: joi.string().required(),
      }),
    }),
    english: joi.object({
      title: joi.string().required(),
      banner_image: joi
        .object({
          fieldname: joi.string().required(),
          originalname: joi.string().required(),
          encoding: joi.string().required(),
          mimetype: joi.string().required(),
          destination: joi.string().required(),
          filename: joi.string().required(),
          path: joi.string().required(),
          size: joi.number().required(),
        })
        .required(),
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
        council_profile: joi
          .object({
            fieldname: joi.string().required(),
            originalname: joi.string().required(),
            encoding: joi.string().required(),
            mimetype: joi.string().required(),
            destination: joi.string().required(),
            filename: joi.string().required(),
            path: joi.string().required(),
            size: joi.number().required(),
          })
          .required(),
        council_name: joi.string().required(),
        council_description: joi.string().required(),
      }),
    }),
  });
  return schema.validate(data);
};

// update vidhanSabha validation
const updateVidhanSabhaValidation = (data) => {
  const schema = joi.object({
    marathi: joi.object({
      title: joi.string().required(),
      banner_image: joi
        .object({
          fieldname: joi.string().required(),
          originalname: joi.string().required(),
          encoding: joi.string().required(),
          mimetype: joi.string().required(),
          destination: joi.string().required(),
          filename: joi.string().required(),
          path: joi.string().required(),
          size: joi.number().required(),
        })
        .required(),
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
        council_profile: joi
          .object({
            fieldname: joi.string().required(),
            originalname: joi.string().required(),
            encoding: joi.string().required(),
            mimetype: joi.string().required(),
            destination: joi.string().required(),
            filename: joi.string().required(),
            path: joi.string().required(),
            size: joi.number().required(),
          })
          .required(),
        council_name: joi.string().required(),
        council_description: joi.string().required(),
      }),
    }),
    english: joi.object({
      title: joi.string().required(),
      banner_image: joi
        .object({
          fieldname: joi.string().required(),
          originalname: joi.string().required(),
          encoding: joi.string().required(),
          mimetype: joi.string().required(),
          destination: joi.string().required(),
          filename: joi.string().required(),
          path: joi.string().required(),
          size: joi.number().required(),
        })
        .required(),
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
        council_profile: joi
          .object({
            fieldname: joi.string().required(),
            originalname: joi.string().required(),
            encoding: joi.string().required(),
            mimetype: joi.string().required(),
            destination: joi.string().required(),
            filename: joi.string().required(),
            path: joi.string().required(),
            size: joi.number().required(),
          })
          .required(),
        council_name: joi.string().required(),
        council_description: joi.string().required(),
      }),
    }),
  });
  return schema.validate(data);
};

module.exports = {
  createVidhanSabhaValidation,
  updateVidhanSabhaValidation,
};
