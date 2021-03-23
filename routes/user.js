const express = require('express');

const router = express.Router();
const validator = require('../helperFunctions/validators/users');
const users = require('../controllers/users');
const issue = require('../controllers/issue');
const authorizer = require('../middleware/authorization');

router.post('/register', validator.signup, users.register);

router.post('/login', validator.signin, users.login);

// amount spent in last 100 days
router.get('/:userId/amount', authorizer.isLoggedIn, issue.last100DayAmount);

router.get('/:userId/books', authorizer.isLoggedIn, issue.getRentedBooks);

router.post('/:userId/makeAdmin', authorizer.isLoggedInAdmin, users.makeAdmin);

router.delete('/:userId', authorizer.isLoggedInAdmin, users.deactivate);

module.exports = router;
