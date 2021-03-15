// eslint-disable-next-line no-unused-vars
const errResponse = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    message: null,
    data: null,
    error: err.message,
  });
};

module.exports = errResponse;
