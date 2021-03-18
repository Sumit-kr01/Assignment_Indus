const Joi = require('joi');

const userSchema = Joi.object().keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  userName: Joi.string().required(),
  password: Joi.string().pattern(new RegExp('^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$')).required(),
  repeatPassword: Joi.ref('password'),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
  isAdmin: Joi.boolean(),
  isActive: Joi.boolean(),
  dob: Joi.date().iso().required(),
});

module.exports = userSchema;
