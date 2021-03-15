/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-useless-catch */
/* eslint-disable new-cap */
/* eslint-disable eqeqeq */
const dotenv = require('dotenv');
const issueQuery = require('../models/query/issue');
const bookQuery = require('../models/query/book');

const errorH = require('../utils/errorHandler');

dotenv.config();
const resp = require('../utils/responseHandler');

/**
 * Query to discard a book
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      nextt-Passes control to next Middleware
 */
async function last100dayamount(req) {
  let docs;
  let response;
  const date = new Date();
  const daysUpto = 100;
  const boundaryDate = new Date(date.setDate(date.getDate() - daysUpto));
  const admin = req.userData.isAdmin;
  if (admin) {
    docs = await issueQuery.aggregation(req, boundaryDate);
    if (docs.length == 0) {
      response = new resp('No issues in last 100 days for this user', null);
    } else {
      console.log(`Total cost in last 100 days = ${docs[0].total}`);
      response = new resp(`Total cost in last 100 days = ${docs[0].total}`, null);
    }
  } else if (req.userData.id == req.params.userId) {
    docs = await issueQuery.aggregationUser(req, boundaryDate);
    if (docs.length == 0) {
      response = new resp('No issues in last 100 days for this user', null);
    } else {
      console.log(`Total cost in last 100 days = ${docs[0].total}`);
      response = new resp(`Total cost in last 100 days = ${docs[0].total}`, null);
    }
  } else {
    throw new errorH.authFailed('Invalid token supplied');
  }
  console.log(response);
  return response;
}

/**
 * Query to get all the rented books by a user
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      nextt-Passes control to next Middleware
 */
async function getRented(req) {
  let docs;
  const { userData } = req;
  const bookArr = [];
  let response;
  if (req.params.userId != userData.id) {
    throw new errorH.badRequest('Invalid request');
  } else if (userData.isAdmin) {
    docs = await issueQuery.findBooksByUserIdAdmin(req.body.userId, userData.id);
    if (docs.length == 0) {
      response = new resp('No book rented to this user', null);
    } else {
      console.log(docs); console.log(docs[0].bookId.title);
      for (const item of docs) {
        console.log(item.bookId.title);
        bookArr.push(item.bookId.title);
      }
      bookArr.push(`Total number of books rented is ${docs.length}.`);
      response = new resp('Following books are rented:', bookArr);
    }
  } else {
    docs = await issueQuery.findBooksByUserId(userData.id);
    if (docs.length == 0) {
      response = new resp('No book rented to this user', null);
    } else {
      console.log(docs); console.log(docs[0].bookId.title);
      for (const item of docs) {
        console.log(item.bookId.title);
        bookArr.push(item.bookId.title);
      }
      bookArr.push(`Total number of books rented is ${docs.length}.`);
      response = new resp('Following books are rented:', bookArr);
    }
  }
  return response;
}

/**
 * Query to issue a book to user
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      nextt-Passes control to next Middleware
 */
async function issueBook(userData, params) {
  // eslint-disable-next-line prefer-destructuring
  const user = userData;
  let result;
  const { bookId } = params;
  const bookData = await bookQuery.findById(bookId);
  if (bookData.length == 0) {
    throw new errorH.badRequest('Book not found');
  } else {
    const copies = await bookData[0].copies;

    const issuedCopies = await issueQuery.findByBookId({ bookId, active: true });

    const avlCopies = copies - issuedCopies;
    if (avlCopies > 0) {
      const presentDate = Date.now();
      const userDOB = Date.parse(user.dob);
      // let DOB = new Date(d);

      const userAge = Math.ceil((presentDate - userDOB) / (1000 * 60 * 60 * 24 * 365));
      const bookAgeCategory = bookData[0].minAgeCategory;
      if (userAge < bookAgeCategory) {
        result = new resp('This book cannot be issued to your age group.', null);
      } else {
        const numberOfIssues = await issueQuery.findByUserId({ userId: user.id, active: true });
        if (numberOfIssues >= 5) {
          throw new errorH.badRequest('Cannot issue more than 5 books!!!!');
        } else {
          console.log('Book can be issued');

          const issueDoc = await issueQuery.saveIssue({
            bookId,
            price: bookData[0].price,
            userId: user.id,
            userName: user.username,
          });
          result = issueDoc;
        }
      }
    } else {
      result = new resp('This book is currently out of stock', null);
    }
    return result;
  }
}
// }

/**
 * Query to find the number of days after which a book can be rented if currently out of stock
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      nextt-Passes control to next Middleware
 */
async function daysToRent(bookId) {
  let result;
  const bookData = await bookQuery.findById(bookId);
  if (bookData.length == 0) {
    throw new errorH.badRequest('No books with given BookId');
  } else {
    const { copies } = bookData[0];
    const issuedCopies = await issueQuery.findByBookId({ bookId, active: true });

    const avlCopies = copies - issuedCopies;
    if (avlCopies > 0) {
      console.log('Book can be rented now');
      result = new resp('Book can be rented now', null);
    } else {
      const oldestIssueDate = await issueQuery.findByBookIdandSort({ bookId, active: true });
      // console.log(oldest[0].returnDate);
      const nearestReturnDate = await oldestIssueDate[0].returnDate;
      const Presentdate = Date.now();
      const numOfDays = Math.ceil((nearestReturnDate.getTime() - Presentdate) / (1000 * 60 * 60 * 24));
      console.log(numOfDays);
      // res.send(`This book can be rented after ${numOfDays} days `);
      // new Date(date.setDate(date.getDate() - daysUpto));
      result = new resp(`This book can be rented after ${numOfDays} days.`, null);
    }
  }
  return result;
}

/**
 * Query to count total number of rented books
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      nextt-Passes control to next Middleware
 */
async function countRented() {
  const docs = await issueQuery.countRented();
  return new resp(`Total number of rented books in the store is ${docs}`, docs);
}
module.exports = {
  last100dayamount, getRented, issueBook, daysToRent, countRented,
};
