const User = require('../schema/user');

async function userFindOne(value) {
  const docs = await User.findOne({ userName: value });
  return docs;
}

async function userFindOneSignup(userName, email) {
  const docs = await User.findOne(
    { $or: [{ userName }, { email }] },
  ).countDocuments();
  return docs;
}

async function userSave(object) {
  await object.save();
}

async function findById(id) {
  const docs = await User.findById(id);
  return docs;
}

module.exports = {
  userFindOne, userFindOneSignup, userSave, findById,
};
