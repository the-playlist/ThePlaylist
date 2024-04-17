import ErrorHandler from "../utils/errorHandler";

export default (err, req, res, next) => {
  let error = { ...err };

  error.statusCode = err && err.statusCode ? err.statusCode : 500;
  error.message = err && err.message ? err.message : "Internal Server Error";

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((value) => value.message);
    error = new ErrorHandler(message, 400);
  }

  // if (err.code === 11000) {
  //   const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
  //   error = new ErrorHandler(message, 400);
  // }

  res?.status(error.statusCode).json({
    success: false,
    error,
    description: error.message,
    stack: process.env.NODE_ENV === "production" ? null : error.stack,
  });
};
