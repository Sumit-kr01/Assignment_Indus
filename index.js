/* eslint-disable camelcase */
const express = require('express');

const app = express();
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();
const userRoutes = require('./routes/user');
const bookRoutes = require('./routes/book');
const errResHandler = require('./utils/responseHandlerErr');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(jsonParser);

app.use('/users', userRoutes);
app.use('/books', bookRoutes);
app.use(errResHandler);

module.exports = app;
