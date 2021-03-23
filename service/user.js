/* eslint-disable prefer-destructuring */

/* eslint-disable no-underscore-dangle */
/* eslint-disable no-new */
/* eslint-disable new-cap */
const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/schema/user');
const errorHandler = require('../utils/errorHandler');
const userQuery = require('../models/query/user');

dotenv.config();
const ResponseClass = require('../utils/responseHandlerClass');

const { tokenSecret } = process.env;

/**
 * Query to register a user is provided emailId or userName doesn't exist
 * @param  {object} req Request
 * @param  {object} res Response
 * @param  {*}      next Passes control to next Middleware
 */
async function signup(data) {
  const existing = await userQuery.userFindOneSignup(data.userName, data.email);
  if (existing) {
    console.log('hello');
    throw new errorHandler.existingUser('Username or email already exists.');
  } else {
    const newuser = new User({
      firstName: data.firstName,
      lastName: data.lastName,
      userName: data.userName,
      password: bcrypt.hashSync(data.password, salt),
      email: data.email,
      isAdmin: false,
      isActive: data.isActive,
      dob: data.dob,
    });
    // await newuser.save();
    await userQuery.userSave(newuser);
    return new ResponseClass('Registration successful', null);
  }
}

//--------------------------------------------------------------------------------------------------
/**
 * Query to login a user and return login token
 * @param  {object} req-Request
 * @param  {object} res-Response
 * @param  {*}      nextt-Passes control to next Middleware
 */
async function login(data) {
  // try {
  const { userName, password } = data;
  const userData = await userQuery.userFindOne(userName);
  if (userData == null) { /* resObj[0].error='User not found';resObj[1].code=401; */
    throw new errorHandler.notFound('Invalid User or user not found');
  } else {
    const passchk = bcrypt.compareSync(password, userData.password);
    if (passchk) {
      const payload = {
        email: userData.email,
        username: userData.userName,
        isAdmin: userData.isAdmin,
        id: userData._id,
        dob: userData.dob,
      };
      const token = jwt.sign(payload, tokenSecret, { expiresIn: 60 * 60 });
      // res.status(200).json(new resp('Login successful', { token }));
      return new ResponseClass('Login successful', { token });
    }

    throw new errorHandler.authFailed('Password Incorrect!!');
  }
  // }
  // catch (err) {
  //   throw err;
  // }
}

/**
 * Service to change user controls to admin if currently logged in user is admin
 * @param  {string} userId
 */
async function makeAdmin(userId) {
  let response;
  const result = await userQuery.findById(userId);
  if (result == null) {
    throw new errorHandler.badRequest('No user with given userId');
  } else if (result.isAdmin === true) {
    throw new errorHandler.badRequest('This user is already an admin.');
  } else {
    result.isAdmin = true;
    await userQuery.userSave(result)
      .then(() => { response = new ResponseClass('User is now admin.', result._id); })
      .catch(() => { throw new errorHandler.badRequest('Internal server error'); });
  }
  return response;
}

/**
 * Service to deactivate a user
 * @param  {string} userId
 */
async function deactivate(userId) {
  let response;
  const result = await userQuery.findById(userId);
  if (result == null) {
    throw new errorHandler.badRequest('No user with given userId');
  } else if (result.isActive === false) {
    throw new errorHandler.badRequest('This user is already inactive .');
  } else {
    result.isActive = false;
    await userQuery.userSave(result)
      .then(() => { response = new ResponseClass('User Deactivated.', result); })
      .catch(() => { throw new errorHandler.badRequest('Internal server error'); });
  }
  return response;
}

module.exports = {
  signup, login, makeAdmin, deactivate,
};
