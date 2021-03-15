const { response } = require('express');
const issueService = require('../service/issue');

/**
 * Controller to fin the amount spent by user in last 100 days
 * @param  {object} req Request
 * @param  {object} res Response
 * @param  {*}      next Pass control to next middleware function
 */
async function last100DayAmount(req, res, next) {
  try {
    const result = await issueService.last100dayamount(req); console.log(response);
    res.status(200).json(result);
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
    const docs = await issueService.getRented(req);
    res.status(200).json(docs);
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
    res.status(200).json(result);
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
    res.status(200).json(result);
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
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  last100DayAmount, getRentedBooks, issueBook, daysToRent, countRented,
};