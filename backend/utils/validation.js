// backend/utils/validation.js
const { validationResult } = require('express-validator');

// **Middleware to Handle Validation Errors**
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    
    // Format the validation errors
    validationErrors.array().forEach((error) => {
      errors[error.path] = error.msg;
    });

    // Create a custom error object
    const err = new Error('Bad Request');
    err.errors = errors;
    err.status = 400;
    err.title = 'Bad Request';
    
    return next(err); // Pass the error to the next middleware
  }

  next(); // Proceed to the next middleware if no errors
};

module.exports = {
  handleValidationErrors,
};
