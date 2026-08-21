const Joi = require("joi");

const userSchema = Joi.object({
  role_id: Joi.number().integer().positive().required(),

  name: Joi.string().min(2).max(100).required(),

  username: Joi.string().min(3).max(100).required(),

  email: Joi.string().email().max(255).required(),

  password: Joi.string().min(6).max(100).required(),

  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .allow("", null)
});

const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body, {
    abortEarly: false
  });

  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.details.map((detail) => detail.message)
    });
  }

  next();
};

module.exports = validateUser;