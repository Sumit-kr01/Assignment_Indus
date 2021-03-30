/* eslint-disable consistent-return */
/* eslint-disable max-len */
const responseHandler = require('../utils/responseHandler');

const userService = require('../service/user');

/**
 * Controller to register any user
 * @param  {object} req Request
 * @param  {object} res Response
 * @param  {*}      next Pass control to next middleware function
 */
async function register(req, res, next) {
  try {
    const signup = await userService.signup(req.data);
    return responseHandler(res, signup);
  } catch (err) {
    next(err);
  }
}

/**
 * Controller to login a user with username and password
 * @param  {object} req Request
 * @param  {object} res Response
 * @param  {*}      next Pass control to next middleware function
 */
async function login(req, res, next) {
  try {
    const result = await userService.login(req.data);
    return responseHandler(res, result);
  } catch (err) {
    next(err);
  }
}

/**
 * Controller to make a user admin if user logged in is an admin
 * @param  {object} req Request'../schema/issue'
 * @param  {object} res Response
 * @param  {*}      next Pass control to next middleware function
 */
async function makeAdmin(req, res, next) {
  try {
    const result = await userService.makeAdmin(req.params.userId);
    return responseHandler(res, result);
  } catch (err) {
    next(err);
  }
}

/**
 * Controller to deactivate a user
 * @param  {object} req Request
 * @param  {object} res Response
 * @param  {*}      next Pass control to next middleware function
 */
async function deactivate(req, res, next) {
  try {
    const result = await userService.deactivate(req.params.userId);
    return responseHandler(res, result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register, login, makeAdmin, deactivate,
};
