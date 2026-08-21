const Joi = require("joi");

const createBookCopySchema = Joi.object({
  book_id: Joi.number().integer().positive().required()
});

const updateBookCopySchema = Joi.object({
  status: Joi.string()
    .valid("maintenance")
    .required()
});

const validateCreateBookCopy = (req, res, next) => {
  const { error, value } = createBookCopySchema.validate(req.body, {
    abortEarly: false
  });

  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.details.map((detail) => detail.message)
    });
  }

  req.body = value;
  next();
};

const validateUpdateBookCopy = (req, res, next) => {
  const { error, value } = updateBookCopySchema.validate(req.body, {
    abortEarly: false
  });

  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.details.map((detail) => detail.message)
    });
  }

  req.body = value;
  next();
};

module.exports = {
  validateCreateBookCopy,
  validateUpdateBookCopy
};