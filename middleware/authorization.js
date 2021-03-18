/* eslint-disable new-cap */
/* eslint-disable max-len */
const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');

const errorHandler = require('../utils/errorHandler');

dotenv.config();

const { tokenSecret } = process.env;

/**
 * Middleware function to check if a user is logged in
 * @param  {object} req Request
 * @param  {object} res Response
 * @param  {*}      next Pass control to next middleware function
 */
async function isLoggedIn(req, res, next) {
  // check for token in the header first, then if not provided, it checks whether it's supplied in the body of the request
  try {
    if (!req.header('Authorization')) { throw new errorHandler.authFailed('No token supplied'); }
    const token = req.headers['x-access-token'] || req.header('Authorization').split(' ')[1];
    if (token) {
      jwt.verify(token, tokenSecret, (err, decoded) => {
        if (!err) {
          req.userData = decoded;// this add the decoded payload to the client req (request) object and make it available in the routes
          next();
        } else {
          res.status(403).send('Invalid token supplied');
        }
      });
    } else {
      throw new errorHandler.authFailed('No token supplied');
    }
  } catch (err) {
    res.status(err.statusCode).send(err.message);
  }
}

/**
 * Middleware function to check if user logged in is an admin
 * @param  {object} req Request
 * @param  {object} res Response
 * @param  {*}      next Pass control to next middleware function
 */
async function isLoggedInAdmin(req, res, next) {
  // check for token in the header first, then if not provided, it checks whether it's supplied in the body of the request
  try {
    if (!req.header('Authorization')) { throw new errorHandler.authFailed('No token supplied'); }
    const token = req.headers['x-access-token'] || req.header('Authorization').split(' ')[1];
    if (token) {
      jwt.verify(token, tokenSecret, (err, decoded) => {
        if (!err) {
          req.userData = decoded; // this add the decoded payload to the client req (request) object and make it available in the routes
          console.log(req.userData);
          if (decoded.isAdmin) {
            next();
          } else {
            throw new errorHandler.authFailed('User must be admin');
          }
        } else {
          throw new errorHandler.authFailed('Invalid token supplied');
        }
      });
    } else {
      throw new errorHandler.authFailed('No token supplied');
    }
  } catch (err) {
    res.status(err.statusCode).send(err.message);
  }
}

module.exports = { isLoggedIn, isLoggedInAdmin };
