class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // so this equal new Error(message)

    this.statusCode = statusCode;
    // status if start with 4 so fail, starts with 5 error
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    // I will use appError class for operational errors
    this.isOperational = true;

    // we add it to StackTrace so to know where the error happens by write `err.stack`
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
