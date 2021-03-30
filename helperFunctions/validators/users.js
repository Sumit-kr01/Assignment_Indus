/* eslint-disable new-cap */
const signupV = require('../../models/validationSchema/userSignupValidator');
const loginV = require('../../models/validationSchema/userLoginValidatior');
const errorHandler = require('../../utils/errorHandler');

/**
 * Function to validate inputs while new user signup
 * @param  {object} req Request
 * @param  {object} res Response
 * @param  {*}      next Pass control to next middleware function
 */
async function signup(req, res, next) {
  try {
    const data = await req.body;
    const output = signupV.validate(data);
    if (output.error) {
      throw new errorHandler.badRequest(output.error.details[0].message);
    } else {
      req.data = data;
      next();
    }
  } catch (err) {
    next(err);
  }
}

/**
 * Function to validate inputs while new user login
 * @param  {object} req Request
 * @param  {object} res Response
 * @param  {*}      next Pass control to next middleware function
 */
async function signin(req, res, next) {
  try {
    const loginData = await req.body;
    const output = loginV.validate(loginData);
    if (output.error) {
      throw new errorHandler.badRequest(output.error.details[0].message);
    } else {
      req.data = loginData;
      next();
    }
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, signin };
