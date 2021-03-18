/* eslint-disable no-unused-vars */
const dotenv = require('dotenv');
const app = require('./index');

const dbConnection = require('./utils/dbConnection');

const redisConnection = require('./utils/redisConnection');

dotenv.config();
const PORT = process.env.PORT || 4000;

app.listen(PORT, (err, res) => {
  if (err) {
    console.log(err);
    process.exit(1);
  } else {
    console.log(`Server running on http://localhost/${PORT}`);
  }
});
