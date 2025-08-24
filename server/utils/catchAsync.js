// will receive a function fn on it
const catchAsync = (fn) => {
  // mke another function call it so just call it when request happen
  return (req, res, next) => {
    // if my function return promise with error because its async so will catch here and send to the global error handler
    // we catch next because we will send the error in next
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
