/* eslint-disable consistent-return */
const issueService = require('../service/issue');

const responseHandler = require('../utils/responseHandler');

/**
 * Controller to find the amount spent by user in last 100 days
 * @param  {object} req Request
 * @param  {object} res Response
 * @param  {*}      next Pass control to next middleware function
 */
async function last100DayAmount(req, res, next) {
  try {
    const result = await issueService.last100dayamount(req.body, req.params, req.userData);
    return responseHandler(res, result);
  } catch (err) {
    next(err);
  }
}

/**
 * Controller to get all the books rented by a user
 * @param  {object} req Request
 * @param  {object} res Response
 * @param  {*}      next Pass control to next middleware function
 */
async function getRentedBooks(req, res, next) {
  try {
    const docs = await issueService.getRented(req.userData, req.params, req.body);
    return responseHandler(res, docs);
  } catch (err) {
    next(err);
  }
}

/**
 * Controller to issue a book to logged in user
 * @param  {object} req Request
 * @param  {object} res Response
 * @param  {*}      next Pass control to next middleware function
 */
async function issueBook(req, res, next) {
  try {
    const result = await issueService.issueBook(req.userData, req.params);
    return responseHandler(res, result);
  } catch (err) {
    next(err);
  }
}

/**
 * Controller to find the number of days after which a book can be rented if currently out of stock
 * @param  {object} req Request
 * @param  {object} res Response
 * @param  {*}      next Pass control to next middleware function
 */
async function daysToRent(req, res, next) {
  try {
    const result = await issueService.daysToRent(req.params.bookId);
    return responseHandler(res, result);
  } catch (err) {
    next(err);
  }
}

/**
 * Controller to count total number of rented books
 * @param  {object} req Request
 * @param  {object} res Response
 * @param  {*}      next Pass control to next middleware function
 */
async function countRented(req, res, next) {
  try {
    const result = await issueService.countRented();
    return responseHandler(res, result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  last100DayAmount, getRentedBooks, issueBook, daysToRent, countRented,
};
