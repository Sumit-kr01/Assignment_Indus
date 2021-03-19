const Book = require('../schema/book');
const Response = require('../../utils/responseHandler');
// const ErrorHandler = require('../../utils/errorHandler');

async function findBookByTitle(title) {
  const docs = await Book.find({ title });
  return docs;
}

async function saveBook(object) {
  const newBook = new Book(object);
  await newBook.save();
  return new Response('Book added successfully.', null);
}

async function findById(id) {
  const docs = await Book.find({ _id: id, isDiscarded: false });
  return docs;
}

async function findByGenre(genre, offset) {
  const docs = await Book.find({ genre, isDiscarded: false },
    null, { skip: Number(offset), limit: 50 });
  return docs;
}

async function countAll() {
  const docs = await Book.aggregate([{ $match: { isDiscarded: false } }, { $group: { _id: '', total: { $sum: '$copies' } } }]);
  return docs;
}

async function findByAuthor(parameter, offset) {
  const docs = await Book.find(parameter, null, { skip: Number(offset), limit: 50 });
  return docs;
}

async function findByAuthorNamePattern(pattern, offset) {
  const docs = await Book.find({
    $or: [{ 'author.fName': new RegExp(`${pattern}`) }, { 'author.lName': new RegExp(`${pattern}`) }],
  }, null, { skip: Number(offset), limit: 50 });
  return docs;
}

async function findByIdAndUpdate(bookId, data) {
  const docs = await Book.findByIdAndUpdate(bookId, data, { new: true });
  return docs;
}

async function findByIdAll(id) {
  const docs = await Book.findById(id);
  return docs;
}

module.exports = {
  findBookByTitle,
  saveBook,
  findById,
  findByGenre,
  countAll,
  findByAuthor,
  findByAuthorNamePattern,
  findByIdAndUpdate,
  findByIdAll,
};
