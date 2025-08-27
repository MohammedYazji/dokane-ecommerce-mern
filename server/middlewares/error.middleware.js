import AppError from "../utils/appError.js";

// function to send errors when we are in development
const sendDevError = (err, res) => {
  // in development send another information about the error like 1) stack [where the error happens] and 2) the whole error object
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

// function to send errors when we are in the production
const sendProdError = (err, res) => {
  // Operational errors
  if (err.isOperational) {
    // just simple human friendly response in production
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // this if the error was programming error [pug in my code] [don't see any details to the clients]
  else {
    // 1) Log error [to know the error in hosting platforms]
    console.error("Error 💥", err);
    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((val) => val.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV === "production") {
    // its not best practice to mutate the original error object so we copy it before
    let error = Object.create(err);

    if (error.name === "ValidationError") {
      error = handleValidationErrorDB(error);
    }

    sendProdError(error, res);
  }
};

export default globalErrorHandler;
