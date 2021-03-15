const bookAddVaidator = require('../../models/validationSchema/bookAddValidator');
const bookUpdateValidator = require('../../models/validationSchema/bookUpdateValidator');

/**
 * Function to validate inputs while adding a new book.
 * @param  {object} req Request
 * @param  {object} res Response
 * @param  {*}      next Pass control to next middleware function
 */
async function addBook(req, res, next) {
  const data = await req.body;
  const output = bookAddVaidator.validate(data);
  console.log(output);
  const resObj = { message: '', data: '', error: '' };
  if (output.error) {
    resObj.error = output.error.details[0].message;
    res.send(resObj);
  } else {
    req.data = data;
    next();
  }
}

/**
 * Function to validate inputs while updating book
 * @param  {object} req Request
 * @param  {object} res Response
 * @param  {*}      next Pass control to next middleware function
 */
async function updateBook(req, res, next) {
  const data = await req.body;

  const output = bookUpdateValidator.validate(data);

  const resObj = { message: '', data: '', error: '' };
  if (output.error) {
    resObj.error = output.error.details[0].message;
    res.send(resObj);
  } else {
    req.data = data;
    next();
  }
}

module.exports = { addBook, updateBook };
