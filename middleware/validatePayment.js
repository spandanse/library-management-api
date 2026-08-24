const Joi = require("joi");

const createPaymentSchema = Joi.object({
  record_id: Joi.number().integer().positive().required(),
  amount: Joi.number().positive().required(),
  payment_date: Joi.date().iso().required(),
  payment_method: Joi.string().trim().max(30).required(),
  status: Joi.string()
    .valid("pending", "completed", "failed")
    .default("pending")
});

const validateCreatePayment = (req, res, next) => {
  const { error, value } = createPaymentSchema.validate(req.body, {
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
  validateCreatePayment
};