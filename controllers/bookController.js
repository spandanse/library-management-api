const { Book, BookCopy, sequelize } = require("../models");

const { Op } = require("sequelize");

const getBooks = async (req, res) => {
  try {
    const {
      search = {},
      filter = {},
      sort = {}
    } = req.body || {};

    const where = {};

    // Search by book name/title
    if (search.name) {
      where.title = {
        [Op.iLike]: `%${search.name}%`
      };
    }

    // Filter by subject
    if (filter.subject) {
      where.subject = {
        [Op.iLike]: `%${filter.subject}%`
      };
    }

    // Allowed sorting fields
    const sortFields = {
      name: "title"
    };

    const order = [];

    if (sort.name) {
      const direction =
        sort.name.toLowerCase() === "desc"
          ? "DESC"
          : "ASC";

      order.push(["title", direction]);
    }

    // Sort by available copies
    if (sort.copies_available) {
      const direction =
        sort.copies_available.toLowerCase() === "desc"
          ? "DESC"
          : "ASC";

      order.push([
        sequelize.literal(`
          (
            SELECT COUNT(*)
            FROM book_copies AS bc
            WHERE bc.book_id = "Book"."id"
            AND bc.status = 'available'
          )
        `),
        direction
      ]);
    }

    // Default sorting
    if (order.length === 0) {
      order.push(["id", "ASC"]);
    }

    const books = await Book.findAll({
      where,

      attributes: {
        include: [
          [
            sequelize.literal(`
              (
                SELECT COUNT(*)
                FROM book_copies AS bc
                WHERE bc.book_id = "Book"."id"
                AND bc.status = 'available'
              )
            `),
            "copies_available"
          ]
        ]
      },

      include: {
        model: BookCopy,
        as: "copies",
        attributes: ["id", "status"]
      },

      order
    });

    res.status(200).json(books);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch books"
    });
  }
};

const getBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findByPk(id, {
      include: {
        model: BookCopy,
        as: "copies",
        attributes: ["id", "status"]
      }
    });

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch book"
    });
  }
};

const createBook = async (req, res) => {
  const transaction = await Book.sequelize.transaction();

  try {
    const {
      isbn,
      title,
      author,
      subject,
      publication_date,
      description,
      copies = 0
    } = req.body;

    const book = await Book.create(
      {
        isbn,
        title,
        author,
        subject,
        publication_date,
        description
      },
      { transaction }
    );

    const bookCopies = [];

    for (let i = 0; i < copies; i++) {
      bookCopies.push({
        book_id: book.id,
        status: "available"
      });
    }

    if (bookCopies.length > 0) {
      await BookCopy.bulkCreate(bookCopies, {
        transaction
      });
    }

    await transaction.commit();

    const createdBook = await Book.findByPk(book.id, {
      include: {
        model: BookCopy,
        as: "copies",
        attributes: ["id", "status"]
      }
    });

    res.status(201).json(createdBook);
  } catch (error) {
    await transaction.rollback();

    console.error(error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "ISBN already exists"
      });
    }

    res.status(500).json({
      message: "Failed to create book"
    });
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findByPk(id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    const {
      isbn,
      title,
      author,
      subject,
      publication_date,
      description
    } = req.body;

    await book.update({
      isbn,
      title,
      author,
      subject,
      publication_date,
      description
    });

    const updatedBook = await Book.findByPk(id, {
      include: {
        model: BookCopy,
        as: "copies",
        attributes: ["id", "status"]
      }
    });

    res.status(200).json(updatedBook);
  } catch (error) {
    console.error(error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "ISBN already exists"
      });
    }

    res.status(500).json({
      message: "Failed to update book"
    });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findByPk(id, {
      include: {
        model: BookCopy,
        as: "copies"
      }
    });

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    if (book.copies.length > 0) {
      return res.status(409).json({
        message: "Cannot delete book because it has physical copies"
      });
    }

    await book.destroy();

    return res.status(200).json({
      message: "Book deleted successfully"
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to delete book"
    });
  }
};

module.exports = {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook
};