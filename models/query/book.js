const Book = require('../schema/book');
const Response = require('../../utils/responseHandlerClass');

/**
 * Query to find a book by its title
 * @param  {string} title BookTitle
 */
async function findBookByTitle(title) {
  const docs = await Book.find({ title });
  return docs;
}

/**
 * Query to save a book
 * @param  {object} object BookTitle
 */
async function saveBook(object) {
  const newBook = new Book(object);
  await newBook.save();
  return new Response('Book added successfully.', null);
}

/**
 * Query to find a book by its ID
 * @param  {string} id BookID
 */
async function findById(id) {
  const docs = await Book.find({ _id: id, isDiscarded: false });
  return docs;
}

/**
 * Query to find a book by its genre and skip n number of documents from top
 * @param  {string} genre Genre
 * @param  {number} offset skip n documents from top
 */
async function findByGenre(genre, offset) {
  const docs = await Book.find({ genre, isDiscarded: false },
    null, { skip: Number(offset), limit: 50 });
  return docs;
}

/**
 * Query to count total number of books in store
 */
async function countAll() {
  const docs = await Book.aggregate([{ $match: { isDiscarded: false } }, { $group: { _id: '', total: { $sum: '$copies' } } }]);
  return docs;
}

/**
 * Query to find a book by its author name.
 * @param  {object} parameter Author Name
 * @param  {nunber} offset skip n documents from top
 */
async function findByAuthor(parameter, offset) {
  const docs = await Book.find(parameter, null, { skip: Number(offset), limit: 50 });
  return docs;
}

/**
 * Query to find a book by its author name pattern
 * @param  {object} parameter Author's Name pattern
 * @param  {nunber} offset skip n documents from top
 */
async function findByAuthorNamePattern(pattern, offset) {
  const docs = await Book.find({
    $or: [{ 'author.fName': new RegExp(`${pattern}`) }, { 'author.lName': new RegExp(`${pattern}`) }],
  }, null, { skip: Number(offset), limit: 50 });
  return docs;
}

/**
 * Query to find a book by its ID and update
 * @param  {number} bookId Book ID
 * @param  {object} data book data
 */
async function findByIdAndUpdate(bookId, data) {
  const docs = await Book.findByIdAndUpdate(bookId, data, { new: true });
  return docs;
}

/**
 * Query to find a book by its ID
 * @param  {number} id Book ID
 */
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
