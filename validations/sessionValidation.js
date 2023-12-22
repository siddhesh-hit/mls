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

// create session calender validation
const createSessionCalendarValidation = (data) => {
  const schema = joi.array().items(
    joi.object({
      marathi: joi.object({
        session: joi.string().optional().label("Marathi session is required"),
      }),
      english: joi.object({
        session: joi.string().optional().label("English session is required"),
      }),
      topic_name: joi.string().required().label("Topic name is required"),
      houses: joi.string().required().label("Houses is required"),
      year: joi.string().required().label("Year is required"),
      date: joi.string().required().label("Date is required"),
      docuemnt: imageValidation.required().label("Document is required"),
    })
  );

  return schema.validate(data);
};

// update session calender validation
const updateSessionCalendarValidation = (data) => {
  const schema = joi.object({
    marathi: joi.object({
      session: joi.string().optional().label("Marathi session is required"),
    }),
    english: joi.object({
      session: joi.string().optional().label("English session is required"),
    }),
    topic_name: joi.string().required().label("Topic name is required"),
    houses: joi.string().required().label("Houses is required"),
    year: joi.string().required().label("Year is required"),
    date: joi.string().required().label("Date is required"),
    _id: joi.any().optional(),
    docuemnt: imageValidation.required().label("Document is required"),
  });

  return schema.validate(data);
};

module.exports = {
  createSessionCalendarValidation,
  updateSessionCalendarValidation,
};
