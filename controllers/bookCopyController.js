const { BookCopy, Book } = require("../models");

const getBookCopies = async (req, res) => {
  try {
    const { bookId } = req.params;

    const book = await Book.findByPk(bookId);

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    const copies = await BookCopy.findAll({
      where: {
        book_id: bookId
      },
      order: [["id", "ASC"]]
    });

    res.status(200).json(copies);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch book copies"
    });
  }
};

const getBookCopy = async (req, res) => {
  try {
    const { id } = req.params;

    const copy = await BookCopy.findByPk(id, {
      include: {
        model: Book,
        as: "book",
        attributes: ["id", "isbn", "title", "author"]
      }
    });

    if (!copy) {
      return res.status(404).json({
        message: "Book copy not found"
      });
    }

    res.status(200).json(copy);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch book copy"
    });
  }
};

const createBookCopy = async (req, res) => {
  try {
    const { book_id } = req.body;

    const book = await Book.findByPk(book_id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    const copy = await BookCopy.create({
      book_id,
      status: "available"
    });

    res.status(201).json(copy);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create book copy"
    });
  }
};

const updateBookCopy = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const copy = await BookCopy.findByPk(id);

    if (!copy) {
      return res.status(404).json({
        message: "Book copy not found"
      });
    }

    await copy.update({
      status
    });

    res.status(200).json(copy);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update book copy"
    });
  }
};

const deleteBookCopy = async (req, res) => {
  try {
    const { id } = req.params;

    const copy = await BookCopy.findByPk(id);

    if (!copy) {
      return res.status(404).json({
        message: "Book copy not found"
      });
    }

    if (copy.status !== "available") {
      return res.status(409).json({
        message: "Cannot delete a book copy that is not available"
      });
    }

    await copy.destroy();

    res.status(200).json({
      message: "Book copy deleted successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete book copy"
    });
  }
};

module.exports = {
  getBookCopies,
  getBookCopy,
  createBookCopy,
  updateBookCopy,
  deleteBookCopy
};