/* eslint-disable max-len */
const redis = require('redis');

const bookService = require('../service/book');

const errorHandler = require('../utils/errorHandler');

const redisClient = redis.createClient(6379);

/**
 * Controller to add book into DB
 * @param  {object} req Request
 * @param  {object} res Response
 * @param  {*}      next Pass control to next middleware function
 */
async function addBook(req, res, next) {
  try {
    const response = await bookService.bookAdd(req.data);
    res.status(200).json(response);
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
    res.status(200).json(result);
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
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * Controller to find all books by a given author name
 * @param  {object} req Request
 * @param  {object} res Response
 * @param  {*}      next Pass control to next middle  ware function
 */
async function findByAuthor(req, res, next) {
  try {
    redisClient.smembers(req.query.author, async (err, data) => {
      if (err) {
        throw new errorHandler.internalServer('Some error occured');
      } else if (data.length !== 0) {
        console.log('123');
        for (let i = 0; i < data.length; i++) {
          res.send(JSON.parse(data[i]));
        }
      } else {
        const result = await bookService.findByAuthor(req.query);
        redisClient.zincrby('author', 1, req.query.author);
        redisClient.zrevrange('author', 0, 9, (error, dataa) => {
          console.log(dataa);
          for (let i = 0; i < 10; i++) {
            if (dataa[i] === req.query.author) {
              redisClient.sadd(req.query.author, JSON.stringify(result.data));
            } else {
              continue;
            }
          }
        });

        res.status(200).json(result);
      }
    });
  } catch (err) {
    next(err);
  }
}

async function trendingAuthor(req, res, next) {
  try {
    redisClient.smembers('Book', (err, data) => {
      if (err) {
        console.log(err);
        throw new errorHandler.internalServer('Some error occured');
      } else {
        // const query = { author: data[0] };
        // const  docs = book
        for (let i = 0; i < data.length; i++) {
          console.log(JSON.parse(data[i]));
        }
        res.send(data);
      }
    });
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
    res.status(200).json(result);
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
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

//---------------------------------------------------------------------------------------------------------------------
/**
 * Query to insert book into DB
 * @param  {object} req Request
 * @param  {object} res Response
 * @param  {*}      next Pass control to next middleware function
 */
async function discard(req, res, next) {
  try {
    const result = await bookService.discard(req.params.bookId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  addBook, byGenre, countAll, findByAuthor, findByPattern, update, discard, trendingAuthor,
};

//--------------------------------------------------------------------------------------------------------------------
