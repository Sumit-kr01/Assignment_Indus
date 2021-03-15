const Joi = require('joi');

const bookSchema = Joi.object().keys({
  title: Joi.string().required(),
  copies: Joi.number().integer().greater(0).required()
    .positive(),
  author: { fName: Joi.string().required(), lName: Joi.string().required() },
  price: Joi.number().required().greater(0).positive(),
  genre: Joi.string().required(),
  minAgeCategory: Joi.number().required().integer(),
  isDiscarded: Joi.boolean(),
});

module.exports = bookSchema;
