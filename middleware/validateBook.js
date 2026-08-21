const Joi = require("joi");

const bookSchema = Joi.object({
  isbn: Joi.string().max(20).required(),
  title: Joi.string().min(1).max(255).required(),
  author: Joi.string().min(1).max(150).required(),
  subject: Joi.string().max(100).allow("", null),
  publication_date: Joi.date().iso().allow(null),
  description: Joi.string().allow("", null),
  copies: Joi.number().integer().min(0).default(0)
});

const updateBookSchema = Joi.object({
  isbn: Joi.string().max(20).required(),
  title: Joi.string().min(1).max(255).required(),
  author: Joi.string().min(1).max(150).required(),
  subject: Joi.string().max(100).allow("", null),
  publication_date: Joi.date().iso().allow(null),
  description: Joi.string().allow("", null)
});

const validateBook = (req, res, next) => {
  const { error, value } = bookSchema.validate(req.body, {
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

const validateUpdateBook = (req, res, next) => {
  const { error, value } = updateBookSchema.validate(req.body, {
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
  validateBook,
  validateUpdateBook
};