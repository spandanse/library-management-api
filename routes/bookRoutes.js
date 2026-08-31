const express = require("express");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook
} = require("../controllers/bookController");

const {
  validateBook,
  validateUpdateBook
} = require("../middleware/validateBook");

const router = express.Router();

// Get all books - Public
router.get("/", getBooks);

// Get one book
router.get(
  "/:id",
  authenticate,
  authorize("Librarian", "Student", "Faculty"),
  getBook
);

// Create book - Librarian only
router.post(
  "/",
  authenticate,
  authorize("Librarian"),
  validateBook,
  createBook
);

// Update book - Librarian only
router.put(
  "/:id",
  authenticate,
  authorize("Librarian"),
  validateUpdateBook,
  updateBook
);

// Delete book - Librarian only
router.delete(
  "/:id",
  authenticate,
  authorize("Librarian"),
  deleteBook
);

module.exports = router;
