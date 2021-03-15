const signupV = require('../../models/validationSchema/userSignupValidator');
const loginV = require('../../models/validationSchema/userLoginValidatior');

/**
 * Function to validate inputs while new user signup
 * @param  {object} req Request
 * @param  {object} res Response
 * @param  {*}      next Pass control to next middleware function
 */
async function signup(req, res, next) {
  const data = await req.body;
  const output = signupV.validate(data);
  const resObj = { message: '', data: '', error: '' };
  if (output.error) {
    resObj.error = output.error.details[0].message;
    res.status(400).json(resObj);
  } else {
    req.data = data;
    next();
  }
}

/**
 * Function to validate inputs while new user login
 * @param  {object} req Request
 * @param  {object} res Response
 * @param  {*}      next Pass control to next middleware function
 */
async function signin(req, res, next) {
  const loginData = await req.body;
  const output = loginV.validate(loginData);
  const resObj = { message: '', data: '', error: '' };
  if (output.error) {
    resObj.error = output.error.details[0].message;
    res.status(400).json(resObj);
  } else {
    req.data = loginData;
    next();
  }
}

module.exports = { signup, signin };
