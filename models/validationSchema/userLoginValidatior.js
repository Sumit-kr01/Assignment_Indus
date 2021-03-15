const Joi = require('joi');

const userSchema = Joi.object().keys({
  userName: Joi.string().required(),
  password: Joi.string().pattern(new RegExp('^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$')),

});

module.exports = userSchema;
