const mongoose = require('mongoose');
const Issue = require('../schema/issue');
const Response = require('../../utils/responseHandler');

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

async function findBooksByUserIdAdmin(bodyUserId, tokenUserId) {
  const response = await Issue.find({ userId: bodyUserId || tokenUserId })
    .select('bookId')
    .populate('bookId', 'title')
    .exec();
  return response;
}

async function findBooksByUserId(tokenUserId) {
  const response = await Issue.find({ userId: tokenUserId })
    .select('bookId')
    .populate('bookId', 'title')
    .exec();
  return response;
}

async function findByBookId(object) {
  const result = await Issue.find(object).countDocuments();
  return result;
}

async function findByUserId(object) {
  const result = await Issue.find(object).countDocuments();
  return result;
}

async function saveIssue(object) {
  const newIssue = new Issue(object);
  await newIssue.save();
  return new Response('Book issued Successfully.', null);
}

async function countRented() {
  const result = await Issue.find({ active: true }).countDocuments();
  return result;
}

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
