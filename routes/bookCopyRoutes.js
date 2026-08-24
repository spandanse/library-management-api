const express = require("express");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const {
  getBookCopies,
  getBookCopy,
  createBookCopy,
  updateBookCopy,
  deleteBookCopy
} = require("../controllers/bookCopyController");

const {
  validateCreateBookCopy,
  validateUpdateBookCopy
} = require("../middleware/validateBookCopy");

const router = express.Router();

// Get all copies of a particular book
router.get(
  "/book/:bookId",
  authenticate,
  authorize("Librarian", "Student", "Faculty"),
  getBookCopies
);

// Get one book copy
router.get(
  "/:id",
  authenticate,
  authorize("Librarian", "Student", "Faculty"),
  getBookCopy
);

// Create book copy - Librarian only
router.post(
  "/",
  authenticate,
  authorize("Librarian"),
  validateCreateBookCopy,
  createBookCopy
);

// Update book copy - Librarian only
router.put(
  "/:id",
  authenticate,
  authorize("Librarian"),
  validateUpdateBookCopy,
  updateBookCopy
);

// Delete book copy - Librarian only
router.delete(
  "/:id",
  authenticate,
  authorize("Librarian"),
  deleteBookCopy
);

module.exports = router;