const { promisify } = require('util');

const redisClient = require('../utils/redisConnection');

// Promisify inbuilt functionalities of redis to return results of query.
const smembersAsync = promisify(redisClient.smembers).bind(redisClient);
const saddAsync = promisify(redisClient.sadd).bind(redisClient);
const zincrbyAsync = promisify(redisClient.zincrby).bind(redisClient);
const zrevrangeAsync = promisify(redisClient.zrevrange).bind(redisClient);

/**
 * Function to query in redis Set
 * @param  {object} author Name of the author to query
 */
async function findInSet(author) {
  const result = await smembersAsync(author);
  return result;
}

/**
 * Function to add an author's book data to redis set
 * @param  {object} author Author's name
 * @param  {object} bookData an object containing all the books by given author
 */
async function addToSet(author, bookData) {
  const result = await saddAsync(author, JSON.stringify(bookData));
  return result;
}

/**
 * Function to increment an author's score in sorted set
 * @param  {object} author Name of the author to increment its score in sorted set
 */
async function addToSortedSet(author) {
  const result = await zincrbyAsync('author', 1, author);
  return result;
}

/**
 * Function to scan top 10 authors in sorted set
 */
async function scanTop10inSortedSet() {
  const result = await zrevrangeAsync('author', 0, 9);
  return result;
}

module.exports = {
  findInSet, addToSet, addToSortedSet, scanTop10inSortedSet,
};
