const User = require('../schema/user');

/**
 * Query to find user by username
 * @param  {string} value
 */
async function userFindOne(value) {
  const docs = await User.findOne({ userName: value });
  return docs;
}

/**
 * Query to find user by username or email
 * @param  {string} userName
 * @param  {string} email
 */
async function userFindOneSignup(userName, email) {
  const docs = await User.findOne(
    { $or: [{ userName }, { email }] },
  ).countDocuments();
  return docs;
}

/**
 * Query to save a user
 * @param  {object} object
 */
async function userSave(object) {
  await object.save();
}
/**
 * Query to find user by userId
 * @param  {string} id
 */
async function findById(id) {
  const docs = await User.findById(id);
  return docs;
}

module.exports = {
  userFindOne, userFindOneSignup, userSave, findById,
};
