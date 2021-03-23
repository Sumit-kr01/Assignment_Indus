const mongoose = require('mongoose');
const Issue = require('../schema/issue');
const Response = require('../../utils/responseHandlerClass');

/**
 * Aggregation query for admin to find the total amount spent by user in last 100 days
 * @param  {object} body
 * @param  {object} params
 * @param  {object} boundaryDate
 */
async function aggregation(body, params, boundaryDate) {
  const docs = await Issue.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(body.userId || params.userId),
        issueDate: { $gt: boundaryDate },
      },
    },
    { $group: { _id: 'userName', total: { $sum: '$price' } } },
  ]);
  return docs;
}

/**
 * Aggregation query to find the total amount spent by user in last 100 days
 * @param  {object} params
 * @param  {Date} boundaryDate
 */
async function aggregationUser(params, boundaryDate) {
  const docs = await Issue.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(params.userId),
        issueDate: { $gt: boundaryDate },
      },
    },
    { $group: { _id: 'userName', total: { $sum: '$price' } } },
  ]);
  return docs;
}

/**
 * Query for admin to find all books rented by user
 * @param  {string} bodyUserId
 * @param  {string} tokenUserId
 */
async function findBooksByUserIdAdmin(bodyUserId, tokenUserId) {
  const response = await Issue.find({ userId: bodyUserId || tokenUserId })
    .select('bookId')
    .populate('bookId', 'title')
    .exec();
  return response;
}

/**
 * Query for user to find all books rented by user
 * @param  {string} tokenUserId
 */
async function findBooksByUserId(tokenUserId) {
  const response = await Issue.find({ userId: tokenUserId })
    .select('bookId')
    .populate('bookId', 'title')
    .exec();
  return response;
}

/**
 * Query to find number of issues for book
 * @param  {object} object
 */
async function findByBookId(object) {
  const result = await Issue.find(object).countDocuments();
  return result;
}

/**
 * Query to find number of issues for a user
 * @param  {object} object
 */
async function findByUserId(object) {
  const result = await Issue.find(object).countDocuments();
  return result;
}

/**
 * Query to save an issue record
 * @param  {object} object
 */
async function saveIssue(object) {
  const newIssue = new Issue(object);
  await newIssue.save();
  return new Response('Book issued Successfully.', null);
}

/**
 * Query to count total number of rented books
 */
async function countRented() {
  const result = await Issue.find({ active: true }).countDocuments();
  return result;
}

/**
 * Query to count total issue records of book and sort in order of their issueDate
 */
async function findByBookIdandSort(object) {
  const result = await Issue.find(object).sort({ issueDate: 'asc' });
  return result;
}

module.exports = {
  aggregation,
  aggregationUser,
  findBooksByUserIdAdmin,
  findBooksByUserId,
  findByBookId,
  findByUserId,
  saveIssue,
  countRented,
  findByBookIdandSort,
};
