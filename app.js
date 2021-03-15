const dotenv = require('dotenv');
const app = require('./index');
// eslint-disable-next-line no-unused-vars
const dbConnection = require('./utils/dbConnection');

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
