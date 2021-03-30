/* eslint-disable no-unused-vars */
const dotenv = require('dotenv');

dotenv.config();
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const swaggerDocument = require('./swagger.json');

const app = require('./index');

const dbConnection = require('./utils/dbConnection');

const redisConnection = require('./utils/redisConnection');

const PORT = process.env.PORT || 4000;

app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, (err, res) => {
  if (err) {
    console.log(err);
    process.exit(1);
  } else {
    console.log(`Server running on http://localhost/${PORT}`);
  }
});
