/* eslint-disable no-continue */
/* eslint-disable no-plusplus */
/* eslint-disable no-shadow */
/* eslint-disable brace-style */
/* eslint-disable eqeqeq */
/* eslint-disable new-cap */
const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

const Book = require('../models/schema/book');

const redisQuery = require('../helperFunctions/redisQuery');

const bookQuery = require('../models/query/book');
const errorHandler = require('../utils/errorHandler');
const ResponseClass = require('../utils/responseHandler');

/**
 * Query to insert book into DB
 * @param  {object} req Request
 * @param  {object} res Response
 * @param  {*}      next Passes control to next Middleware
 */
async function bookAdd(data) {
  let response;
  console.log(data);
  const book = await bookQuery.findBookByTitle(data.title);
  if (book.length != 0) {
    throw new errorHandler.existingUser('Book already exists');
  } else {
    const save = await bookQuery.saveBook(data);
    response = save;
  }
  return response;
}

/**
 * Query to find book by given genre
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      nextt-Passes control to next Middleware
 */
async function findByGenre(genre, offset) {
  console.log(genre);
  let result;
  const books = await bookQuery.findByGenre(genre, offset); console.log(books);
  if (books.length == 0) {
    throw new errorHandler.notFound('No books with given genre');
  } else {
    result = new ResponseClass(`Number of books with genre ${genre} is ${books.length}.`, null);
  }
  return result;
}
/**
 * Query to count total number of books in store
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      nextt-Passes control to next Middleware
 */
async function countAllBooks() {
  const docs = await bookQuery.countAll();
  return new ResponseClass(`Total number of books in store is ${docs[0].total}`, docs[0].total);
}

/**
 * Query to find a book by author name
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      nextt-Passes control to next Middleware
 */
async function findByAuthor(query) {
  let result;
  let parsedCacheData;
  const { author } = query;
  const { offset } = query; console.log(offset); console.log(author);

  // First query in cache
  const cacheData = await redisQuery.findInSet(author);

  // If found in cache return data from here
  if (cacheData.length != 0) {
    parsedCacheData = JSON.parse(cacheData);
    await redisQuery.addToSortedSet(author);
    result = new ResponseClass('Books found for given Author Name:', parsedCacheData);
  }
  // Else make a db query
  else if (cacheData.length == 0) {
    const docs = await bookQuery.findByAuthor({ 'author.fName': author.split(' ')[0], 'author.lName': author.split(' ')[1] }, offset);
    if (docs.length == 0) {
      throw new errorHandler.notFound('No books with given author name');
    } else {
      // Increase author score by 1
      await redisQuery.addToSortedSet(author);
      result = new ResponseClass('Books found for given Author Name:', docs);
    }
    // Add author's Book to cache if author is in top 10
    const trendingAuthors = await redisQuery.scanTop10inSortedSet();
    for (let i = 0; i < 10; i++) {
      if (trendingAuthors[i] == author) {
        redisQuery.addToSet(author, docs);
      } else {
        continue;
      }
    }
  }
  return result;
}

async function trendingAuthors() {
  const topAuthors = await redisQuery.scanTop10inSortedSet();
  let result;
  console.log(topAuthors.length);
  if (topAuthors.length == 0) {
    throw new errorHandler.badRequest('No trending authors');
  } else {
    result = new ResponseClass('Top authors in order are:', topAuthors);
  }
  return result;
}

/**
 * Query to find a book by given author name pattern
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      nextt-Passes control to next Middleware
 */
async function findByPattern(query) {
  let result;
  const { pattern, offset } = query;
  const books = await bookQuery.findByAuthorNamePattern(pattern, offset);
  if (books.length == 0) {
    console.log('error');
    throw new errorHandler.notFound('No books with given author name');
  } else {
    console.log('OK');
    result = new ResponseClass('Books found are:', books);
  }
  return result;
}

/**
 * Query to update a book
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      nextt-Passes control to next Middleware
 */
async function update(data, bookId) {
  const docs = await Book.findByIdAndUpdate(bookId, data);
  if (docs === null) {
    throw new errorHandler.notFound('No books found with given BookId');
  } else {
    return new ResponseClass('Book updated successfully', docs);
  }
}

/**
 * Query to discard a book
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      nextt-Passes control to next Middleware
 */
async function discard(bookId) {
  let result;
  const docs = await bookQuery.findByIdAll(bookId);
  if (docs == null) {
    throw new errorHandler.notFound('No books with given BookId found');
  } else if (docs.isDiscarded) {
    throw new errorHandler.badRequest('Book already discarded');
  } else {
    docs.isDiscarded = true;
    await docs.save();
    result = new ResponseClass('Book discarded successfully', docs);
    console.log('discarded');
  }
  return result;
}

module.exports = {
  // eslint-disable-next-line max-len
  bookAdd, findByGenre, countAllBooks, findByAuthor, findByPattern, update, discard, trendingAuthors,
};
