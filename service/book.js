/* eslint-disable eqeqeq */
/* eslint-disable new-cap */
const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

const Book = require('../models/schema/book');

const bookQuery = require('../models/query/book');
const errorH = require('../utils/errorHandler');
const resp = require('../utils/responseHandler');
// eslint-disable-next-line max-len
//-------------------------------------------------------------------------------------------------------------------------

/**
 * Query to insert book into DB
 * @param  {object} req Request
 * @param  {object} res Response
 * @param  {*}      next Passes control to next Middleware
 */
async function bookAdd(req) {
  const { data } = req;
  let response;
  console.log(data);
  const book = await bookQuery.findBookByTitle(data.title);
  if (book.length != 0) {
    throw new errorH.existingUser('Book already exists');
  } else {
    const save = await bookQuery.saveBook(data);
    response = save;
  }
  return response;
}

//--------------------------------------------------------------------------------------------------
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
    throw new errorH.notFound('No books with given genre');
  } else {
    result = new resp(`Number of books with genre ${genre} is ${books.length}.`, null);
  }
  return result;
}
//--------------------------------------------------------------------------------------------------
/**
 * Query to count total number of books in store
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      nextt-Passes control to next Middleware
 */
async function countAllBooks() {
  const docs = await bookQuery.countAll();
  return new resp(`Total number of books in store is ${docs[0].total}`, docs[0].total);
}

//--------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------

// module.exports.findUsingId = async (bookId)=> {

//     let response;
//    await  Book.findById(bookId , (err, docs) =>{
//          if(err){
//              response = err;
//          }
//          else{
//              response = docs;
//              console.log(docs);
//          }
//     })
//     return response;
// }

// async function countIssues(bookId) {
//   const count = await Issue.find({ bookId }).countDocuments();
//   return count;
// }
//--------------------------------------------------------------------------------------------------
/**
 * Query to find a book by author name
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      nextt-Passes control to next Middleware
 */
async function findByAuthor(query) {
  let result;
  const { author } = query;
  const { offset } = query; console.log(offset); console.log(author);

  const docs = await bookQuery.findByAuthor({ 'author.fName': author.split(' ')[0], 'author.lName': author.split(' ')[1] }, offset);
  if (docs.length == 0) {
    throw new errorH.notFound('No books with given author name');
  } else {
    result = new resp('Books found for given Author Name:', docs);
  }
  // eslint-disable-next-line no-shadow
  return result;
}

//--------------------------------------------------------------------------------------------------
/**
 * Query to find a book by given author name pattern
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      nextt-Passes control to next Middleware
 */
async function findByPattern(query) {
  let result;
  const { pattern } = query;
  const books = await bookQuery.findByAuthorNamePattern(pattern);
  if (books.length == 0) {
    console.log('error');
    throw new errorH.notFound('No books with given author name');
  } else {
    console.log('OK');
    result = new resp('Books found are:', books);
  }
  return result;
}

//--------------------------------------------------------------------------------------------------

// updatePrice : async (bookId, newPrice) => {
//     let response;
//     await Book.findByIdAndUpdate(bookId, { $set: { price: Number(newPrice) }}, null, (err,res)=>
// {
//         if(err){
//             response.error = err;
//         }
//         else{
//             response = res;
//         }
//     })
//     return response;
// },

//--------------------------------------------------------------------------------------------------

// updateGenre : async (bookId, newGenre) => {
//     let response;
//     await Book.findByIdAndUpdate(bookId, { $set: { genre: newGenre }}, null, (err,res) => {
//         if(err){
//             response.error = err;
//         }
//         else{
//             response = res;
//         }
//     })
//     return response;
// },

//--------------------------------------------------------------------------------------------------
/**
 * Query to update a book
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      nextt-Passes control to next Middleware
 */
async function update(data, bookId) {
  const docs = await Book.findByIdAndUpdate(bookId, data);
  if (docs === null) {
    throw new errorH.notFound('No books found with given BookId');
  } else {
    return new resp('Book updated successfully', docs);
  }
}

//--------------------------------------------------------------------------------------------------

// module.exports.delete = async (req,res,next) =>{
//     try{
//         let bookId = req.params.bookId;
//         let docs = await Book.findByIdAndRemove( bookId);
//         if(docs == null){
//             throw new errorH.badRequest('No books with given BookId found');
//         }
//         else{
//             res.status(200).json(new resp('Book deleted successfully', docs));
//         }
//     }catch(err){
//         next(err);
//     }

// }
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
    throw new errorH.notFound('No books with given BookId found');
  } else if (docs.isDiscarded) {
    throw new errorH.badRequest('Book already discarded');
  } else {
    docs.isDiscarded = true;
    await docs.save();
    result = new resp('Book discarded successfully', docs);
    console.log('discarded');
  }
  return result;
}

module.exports = {
  // eslint-disable-next-line max-len
  bookAdd, findByGenre, countAllBooks, findByAuthor, findByPattern, update, discard,
};
