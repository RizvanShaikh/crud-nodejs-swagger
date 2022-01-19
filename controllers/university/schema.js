// ==================== Load Internal Modules =========================================
const { Joi } = require("express-validation");
// ==================== Load Internal Modules =========================================

module.exports = {
    universityValidate: {
        body: Joi.object({
            alphaTwoCode: Joi.string().required(),
            country: Joi.string().required(),
            domain: Joi.string().required(),
            webPage: Joi.string().required(),
            name: Joi.string().required(),
            image: Joi.string().allow('').optional(),
            description: Joi.string().required()
        }),
    },
};  