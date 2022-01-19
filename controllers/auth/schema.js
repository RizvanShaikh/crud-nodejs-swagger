const { Joi } = require("express-validation");
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
// const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@$!%*#?&])[A-Za-z0-9$@$!%*#?&]{6,15}$/;
module.exports = {
  signup: {
    body: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().regex(EMAIL_REGEX).required(),
      password: Joi.string().required(),
      dob: Joi.date().allow(null).allow(""),
      image: Joi.string(),
      phoneNumber: Joi.number().required(),
      gender: Joi.string().required(),
      // location: Joi.string().optional(),
      // lat: Joi.number().optional(),
      // long: Joi.number().optional(),
      // deviceId: Joi.string().optional(),
      // deviceType: Joi.string().optional(),
      roleType: Joi.number().optional()
    }),
  },
  login: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    }),
  },
  forgotPassword: {
    body: Joi.object({
      email: Joi.string().email().required()
    }),
  },
};
