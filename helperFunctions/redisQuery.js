const { promisify } = require('util');

const redisClient = require('../utils/redisConnection');

const smembersAsync = promisify(redisClient.smembers).bind(redisClient);
const saddAsync = promisify(redisClient.sadd).bind(redisClient);
const zincrbyAsync = promisify(redisClient.zincrby).bind(redisClient);
const zrevrangeAsync = promisify(redisClient.zrevrange).bind(redisClient);

async function findInSet(author) {
  const result = await smembersAsync(author);
  return result;
}

async function addToSet(author, bookData) {
  const result = await saddAsync(author, JSON.stringify(bookData));
  return result;
}

async function addToSortedSet(author) {
  const result = await zincrbyAsync('author', 1, author);
  return result;
}

async function scanTop10inSortedSet() {
  const result = await zrevrangeAsync('author', 0, 9);
  return result;
}

module.exports = {
  findInSet, addToSet, addToSortedSet, scanTop10inSortedSet,
};
