const joi = require('joi');

// create vidhanSabha validation
const createVidhanSabhaValidation = (data) => {
    const schema = joi.object({
        title: joi.string().required(),
        banner_image: joi.string().required(),
        description: joi.string().required(),
        topics: joi.array().items({
            topics_title: joi.string().required(),
            session: joi.array().items({
                content: joi.array().items({
                    content_name: joi.string().required(),
                    content_document: joi.string().required(),
                    content_createdAt: joi.date(),
                })
            })
        }),
        legislative_council: joi.array().items({
            council_profile: joi.string().required(),
            council_name: joi.string().required(),
            council_description: joi.string().required(),
        })
    })
    return schema.validate(data);
}