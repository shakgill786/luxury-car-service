const { validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = {};
    errors.array().forEach((error) => {
      formattedErrors[error.param] = error.msg;
    });

    return res.status(400).json({
      message: 'Bad Request',
      errors: formattedErrors,
    });
  }
  next();
};

module.exports = { handleValidationErrors };
