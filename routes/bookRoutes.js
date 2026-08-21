const express = require("express");

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

router.get("/", getBooks);
router.get("/:id", getBook);
router.post("/", validateBook, createBook);
router.put("/:id", validateUpdateBook, updateBook);
router.delete("/:id", deleteBook);

module.exports = router;