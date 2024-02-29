const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  let message = err.message;

  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found";
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
    success: false,
  });
};
const DuplicateError = (error) => {
  if (error.name === 'ValidationError') {
    const validationErrors = {};

    // Extract and format Mongoose validation errors
    for (const field in error.errors) {
      validationErrors[field] = error.errors[field].message;
    }
    return Object.keys(validationErrors).length > 0 ? Object.values(validationErrors) : {};
  }
}

module.exports = { notFound, errorHandler, DuplicateError };
