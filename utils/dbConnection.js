/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-destructuring */
const mongoose = require('mongoose');

const dbUrl = process.env.dbUrl;

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log('Error connecting to database');
      process.exit(1);
    } else {
      console.log('Connected to database');
    }
  });

module.exports.dbConnection;
