const express = require("express");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const {
  createRecord,
  getRecords,
  getRecord,
  updateRecord,
  deleteRecord
} = require("../controllers/recordController");

const {
  validateCreateRecord,
  validateUpdateRecord
} = require("../middleware/validateRecord");

const router = express.Router();

// Get all records
router.get(
  "/",
  authenticate,
  authorize("Librarian", "Student", "Faculty"),
  getRecords
);

// Get one record
router.get(
  "/:id",
  authenticate,
  authorize("Librarian", "Student", "Faculty"),
  getRecord
);

// Issue book - Librarian only
router.post(
  "/",
  authenticate,
  authorize("Librarian"),
  validateCreateRecord,
  createRecord
);

// Return book - Librarian only
router.put(
  "/:id",
  authenticate,
  authorize("Librarian"),
  validateUpdateRecord,
  updateRecord
);

// Delete record - Librarian only
router.delete(
  "/:id",
  authenticate,
  authorize("Librarian"),
  deleteRecord
);

module.exports = router;