const express = require("express");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const {
  getPayments,
  getPayment,
  createPayment
} = require("../controllers/paymentController");

const {
  validateCreatePayment
} = require("../middleware/validatePayment");

const router = express.Router();

// Get all payments
router.get(
  "/",
  authenticate,
  authorize("Librarian"),
  getPayments
);

// Get one payment
router.get(
  "/:id",
  authenticate,
  authorize("Librarian"),
  getPayment
);

// Create payment
router.post(
  "/",
  authenticate,
  authorize("Librarian"),
  validateCreatePayment,
  createPayment
);

module.exports = router;