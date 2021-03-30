/* eslint-disable new-cap */
const bookAddVaidator = require('../../models/validationSchema/bookAddValidator');
const bookUpdateValidator = require('../../models/validationSchema/bookUpdateValidator');
const errorHandler = require('../../utils/errorHandler');

/**
 * Function to validate inputs while adding a new book.
 * @param  {object} req Request
 * @param  {object} res Response
 * @param  {*}      next Pass control to next middleware function
 */
async function addBook(req, res, next) {
  try {
    const data = await req.body;
    const output = bookAddVaidator.validate(data);
    if (output.error) {
      throw new errorHandler.badRequest(output.error.details[0].message);
    } else {
      req.data = data;
      next();
    }
  } catch (err) {
    next(err);
  }
}

/**
 * Function to validate inputs while updating book
 * @param  {object} req Request
 * @param  {object} res Response
 * @param  {*}      next Pass control to next middleware function
 */
async function updateBook(req, res, next) {
  try {
    const data = await req.body;
    const output = bookUpdateValidator.validate(data);
    if (output.error) {
      throw new errorHandler.badRequest(output.error.details[0].message);
    } else {
      req.data = data;
      next();
    }
  } catch (err) {
    next(err);
  }
}

module.exports = { addBook, updateBook };
