const Joi = require('joi');

const bookSchema = Joi.object().keys({
  title: Joi.string(),
  copies: Joi.number().integer().greater(0).positive(),
  author: { fName: Joi.string(), lName: Joi.string() },
  // description: Joi.string(),
  price: Joi.number().greater(0).positive(),
  genre: Joi.string(),
});

module.exports = bookSchema;
