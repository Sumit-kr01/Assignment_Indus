const express = require('express');

const router = express.Router();
const validator = require('../helperFunctions/validators/book');
const authorizer = require('../middleware/authorization');
const book = require('../controllers/books');
const issue = require('../controllers/issue');

router.post('/new', authorizer.isLoggedInAdmin, validator.addBook, book.addBook);
router.post('/:bookId/issue', authorizer.isLoggedIn, issue.issueBook);
router.get('/genre/:genre', authorizer.isLoggedIn, book.byGenre);// complete API is like /books/genre/:genre?offset=number
router.get('/all', authorizer.isLoggedIn, book.countAll);
router.get('/rented', authorizer.isLoggedInAdmin, issue.countRented);
router.get('/:bookId/days', authorizer.isLoggedIn, issue.daysToRent);
router.get('/author', authorizer.isLoggedIn, book.findByAuthor);// complete API is like /books/author?author=xyz&offset=number
router.get('/authorName', authorizer.isLoggedIn, book.findByPattern);// /books/authorName?pattern=xyz

// router.patch('/:bookId/price', book.updatePrice);
// router.patch('/:bookId/genre', book.updateGenre);
router.patch('/:bookId', validator.updateBook, authorizer.isLoggedInAdmin, book.update);
router.delete('/:bookId', authorizer.isLoggedInAdmin, book.discard);
module.exports = router;
