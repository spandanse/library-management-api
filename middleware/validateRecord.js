const Joi = require("joi");

const createRecordSchema = Joi.object({
  user_id: Joi.number().integer().positive().required(),

  book_copy_id: Joi.number().integer().positive().required(),

  issue_date: Joi.date().iso().required(),

  due_date: Joi.date()
    .iso()
    .greater(Joi.ref("issue_date"))
    .required()
});

const validateCreateRecord = (req, res, next) => {
  const { error, value } = createRecordSchema.validate(req.body, {
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

const updateRecordSchema = Joi.object({
  return_date: Joi.date().iso().optional()
});

const validateUpdateRecord = (req, res, next) => {
  const { error, value } = updateRecordSchema.validate(req.body, {
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
  validateCreateRecord,
  validateUpdateRecord
};