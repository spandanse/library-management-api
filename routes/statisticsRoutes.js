const express = require("express");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const {
  getStatistics
} = require("../controllers/statisticsController");

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize("Librarian"),
  getStatistics
);

module.exports = router;