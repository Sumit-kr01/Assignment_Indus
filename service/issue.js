/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-useless-catch */
/* eslint-disable new-cap */
/* eslint-disable eqeqeq */
const issueQuery = require('../models/query/issue');
const bookQuery = require('../models/query/book');

const errorHandler = require('../utils/errorHandler');

const ResponseClass = require('../utils/responseHandlerClass');

/**
 * Service to find amount spent by user in last 100 days
 * @param  {object} body
 * @param  {object} params
 * @param  {object} userData
 */
async function last100dayamount(body, params, userData) {
  let docs;
  let response;
  const date = new Date();
  const daysUpto = 100;
  const boundaryDate = new Date(date.setDate(date.getDate() - daysUpto));
  const admin = userData.isAdmin;
  if (admin) {
    docs = await issueQuery.aggregation(body, params, boundaryDate);
    if (docs.length == 0) {
      response = new ResponseClass('No issues in last 100 days for this user', null);
    } else {
      console.log(`Total cost in last 100 days = ${docs[0].total}`);
      response = new ResponseClass(`Total cost in last 100 days = ${docs[0].total}`, null);
    }
  } else if (userData.id == params.userId) {
    docs = await issueQuery.aggregationUser(params, boundaryDate);
    if (docs.length == 0) {
      response = new ResponseClass('No issues in last 100 days for this user', null);
    } else {
      console.log(`Total cost in last 100 days = ${docs[0].total}`);
      response = new ResponseClass(`Total cost in last 100 days = ${docs[0].total}`, null);
    }
  } else {
    throw new errorHandler.authFailed('Invalid token supplied');
  }
  console.log(response);
  return response;
}

/**
 * Service to get all the rented books by a user
 * @param  {object} userData
 * @param  {object} params
 * @param  {object} body
 */
async function getRented(userData, params, body) {
  let docs;
  const bookArr = [];
  let response;
  if (params.userId != userData.id) {
    throw new errorHandler.badRequest('Invalid request');
  } else if (userData.isAdmin) {
    docs = await issueQuery.findBooksByUserIdAdmin(body.userId, userData.id);
    if (docs.length == 0) {
      response = new ResponseClass('No book rented to this user', null);
    } else {
      for (const item of docs) {
        console.log(item.bookId.title);
        bookArr.push(item.bookId.title);
      }
      bookArr.push(`Total number of books rented is ${docs.length}.`);
      response = new ResponseClass('Following books are rented:', bookArr);
    }
  } else {
    docs = await issueQuery.findBooksByUserId(userData.id);
    if (docs.length == 0) {
      response = new ResponseClass('No book rented to this user', null);
    } else {
      console.log(docs); console.log(docs[0].bookId.title);
      for (const item of docs) {
        console.log(item.bookId.title);
        bookArr.push(item.bookId.title);
      }
      bookArr.push(`Total number of books rented is ${docs.length}.`);
      response = new ResponseClass('Following books are rented:', bookArr);
    }
  }
  return response;
}

/**
 * Service to issue a book to user
 * @param  {object} userData
 * @param  {object} params
 */
async function issueBook(userData, params) {
  // eslint-disable-next-line prefer-destructuring
  const user = userData;
  let result;
  const { bookId } = params;
  const bookData = await bookQuery.findById(bookId);
  if (bookData.length == 0) {
    throw new errorHandler.badRequest('Book not found');
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
        result = new ResponseClass('This book cannot be issued to your age group.', null);
      } else {
        const numberOfIssues = await issueQuery.findByUserId({ userId: user.id, active: true });
        if (numberOfIssues >= 5) {
          throw new errorHandler.badRequest('Cannot issue more than 5 books!!!!');
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
      result = new ResponseClass('This book is currently out of stock', null);
    }
    return result;
  }
}
// }

/**
 * Service to find the number of days after which a book can be rented if currently out of stock
 * @param  {string} bookId
 */
async function daysToRent(bookId) {
  let result;
  const bookData = await bookQuery.findById(bookId);
  if (bookData.length == 0) {
    throw new errorHandler.badRequest('No books with given BookId');
  } else {
    const { copies } = bookData[0];
    const issuedCopies = await issueQuery.findByBookId({ bookId, active: true });

    const avlCopies = copies - issuedCopies;
    if (avlCopies > 0) {
      console.log('Book can be rented now');
      result = new ResponseClass('Book can be rented now', null);
    } else {
      const oldestIssueDate = await issueQuery.findByBookIdandSort({ bookId, active: true });
      // console.log(oldest[0].returnDate);
      const nearestReturnDate = await oldestIssueDate[0].returnDate;
      const Presentdate = Date.now();
      const numOfDays = Math.ceil((nearestReturnDate.getTime() - Presentdate) / (1000 * 60 * 60 * 24));
      console.log(numOfDays);
      // res.send(`This book can be rented after ${numOfDays} days `);
      // new Date(date.setDate(date.getDate() - daysUpto));
      result = new ResponseClass(`This book can be rented after ${numOfDays} days.`, null);
    }
  }
  return result;
}

/**
 * Service to count total number of rented books
 */
async function countRented() {
  const docs = await issueQuery.countRented();
  return new ResponseClass(`Total number of rented books in the store is ${docs}`, docs);
}
module.exports = {
  last100dayamount, getRented, issueBook, daysToRent, countRented,
};
