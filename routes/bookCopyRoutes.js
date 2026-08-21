const express = require("express");

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

router.get("/book/:bookId", getBookCopies);
router.get("/:id", getBookCopy);

router.post("/", validateCreateBookCopy, createBookCopy);
router.put("/:id", validateUpdateBookCopy, updateBookCopy);

router.delete("/:id", deleteBookCopy);

module.exports = router;