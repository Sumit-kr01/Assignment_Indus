/* eslint-disable consistent-return */
const responseHandler = require('../utils/responseHandler');

const bookService = require('../service/book');

/**
 * Controller to add book into DB
 * @param  {object} req Request
 * @param  {object} res Response
 * @param  {*}      next Pass control to next middleware function
 */
async function addBook(req, res, next) {
  try {
    const response = await bookService.bookAdd(req.data);
    return responseHandler(res, response);
  } catch (err) {
    next(err);
  }
}

/**
 * Controller to find book by Genre
 * @param  {object} req Request
 * @param  {object} res Response
 * @param  {*}      next Pass control to next middleware function
 */
async function byGenre(req, res, next) {
  try {
    const result = await bookService.findByGenre(req.params.genre, req.query.offset);
    return responseHandler(res, result);
  } catch (err) {
    next(err);
  }
}

/**
 * Controller to count total number of books in store
 * @param  {object} req Request
 * @param  {object} res Response
 * @param  {*}      next Pass control to next middleware function
 */
async function countAll(req, res, next) {
  try {
    const result = await bookService.countAllBooks();
    return responseHandler(res, result);
  } catch (err) {
    next(err);
  }
}

/**
 * Controller to find all books by a given author name
 * @param  {object} req Request
 * @param  {object} res Response
 * @param  {*}      next Pass control to next middleware function
 */
async function findByAuthor(req, res, next) {
  try {
    const result = await bookService.findByAuthor(req.query);

    return responseHandler(res, result);
  } catch (err) {
    next(err);
  }
}

/**
 * Controller to find all books by a given author name
 * @param  {object} req Request
 * @param  {object} res Response
 * @param  {*}      next Pass control to next middleware function
 */
async function trendingAuthor(req, res, next) {
  try {
    const result = await bookService.trendingAuthors();
    return responseHandler(res, result);
  } catch (err) {
    next(err);
  }
}

/**
 * Controller to find all books by a given author name pattern
 * @param  {object} req Request
 * @param  {object} res Response
 * @param  {*}      next Pass control to next middleware function
 */
async function findByPattern(req, res, next) {
  try {
    const result = await bookService.findByPattern(req.query);
    return responseHandler(res, result);
  } catch (err) {
    next(err);
  }
}

/**
 * Query to insert book into DB
 * @param  {object} req Request
 * @param  {object} res Response
 * @param  {*}      next Pass control to next middleware function
 */
async function update(req, res, next) {
  try {
    const result = await bookService.update(req.data, req.params.bookId);
    return responseHandler(res, result);
  } catch (err) {
    next(err);
  }
}

/**
 * Query to insert book into DB
 * @param  {object} req Request
 * @param  {object} res Response
 * @param  {*}      next Pass control to next middleware function
 */
async function discard(req, res, next) {
  try {
    const result = await bookService.discard(req.params.bookId);
    return responseHandler(res, result);
  } catch (err) {
    next(err);
  }
}

// async function findByString(req, res, next) {
//   try {
//     const result = await bookService.findByString(req.body.string);
//     return responseHandler(res, result);
//   } catch (err) {
//     next(err);
//   }
// }

module.exports = {
  addBook,
  byGenre,
  countAll,
  findByAuthor,
  findByPattern,
  update,
  discard,
  trendingAuthor,
  findByString,
};
