const {
  Record,
  User,
  Role,
  BookCopy,
  Book,
  Payment
} = require("../models");

const createRecord = async (req, res) => {
  const transaction = await Record.sequelize.transaction();

  try {
    const {
      user_id,
      book_copy_id,
      issue_date,
      due_date
    } = req.body;

    // Check that the user exists
    const user = await User.findByPk(user_id, {
      transaction
    });

    if (!user) {
      await transaction.rollback();

      return res.status(404).json({
        message: "User not found"
      });
    }

    // Check that the book copy exists
    const bookCopy = await BookCopy.findByPk(book_copy_id, {
      transaction
    });

    if (!bookCopy) {
      await transaction.rollback();

      return res.status(404).json({
        message: "Book copy not found"
      });
    }

    // Check that the copy is available
    if (bookCopy.status !== "available") {
      await transaction.rollback();

      return res.status(409).json({
        message: "Book copy is not available"
      });
    }

    // Create lending record
    const record = await Record.create(
      {
        user_id,
        book_copy_id,
        issue_date,
        due_date,
        status: "issued"
      },
      {
        transaction
      }
    );

    // Mark copy as borrowed
    await bookCopy.update(
      {
        status: "borrowed"
      },
      {
        transaction
      }
    );

    // Commit transaction
    await transaction.commit();

    // Fetch created record with related data
    const createdRecord = await Record.findByPk(record.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "username", "email"]
        },
        {
          model: BookCopy,
          as: "bookCopy",
          include: {
            model: Book,
            as: "book",
            attributes: ["id", "isbn", "title", "author"]
          }
        }
      ]
    });

    return res.status(201).json(createdRecord);
  } catch (error) {
    await transaction.rollback();

    console.error(error);

    return res.status(500).json({
      message: "Failed to create lending record"
    });
  }
};

const getRecords = async (req, res) => {
  try {
    const records = await Record.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "username", "email"],
          include: {
            model: Role,
            as: "role",
            attributes: ["id", "name"]
          }
        },
        {
          model: BookCopy,
          as: "bookCopy",
          attributes: ["id", "status"],
          include: {
            model: Book,
            as: "book",
            attributes: ["id", "isbn", "title", "author"]
          }
        },
        {
          model: Payment,
          as: "payments"
        }
      ],
      order: [["id", "ASC"]]
    });

    res.status(200).json(records);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch records"
    });
  }
};

const getRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await Record.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "username", "email"],
          include: {
            model: Role,
            as: "role",
            attributes: ["id", "name"]
          }
        },
        {
          model: BookCopy,
          as: "bookCopy",
          attributes: ["id", "status"],
          include: {
            model: Book,
            as: "book",
            attributes: ["id", "isbn", "title", "author"]
          }
        },
        {
          model: Payment,
          as: "payments"
        }
      ]
    });

    if (!record) {
      return res.status(404).json({
        message: "Record not found"
      });
    }

    res.status(200).json(record);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch record"
    });
  }
};

const updateRecord = async (req, res) => {
  const transaction = await Record.sequelize.transaction();

  try {
    const { id } = req.params;
    const { return_date } = req.body;

    const record = await Record.findByPk(id, {
      include: {
        model: BookCopy,
        as: "bookCopy"
      },
      transaction
    });

    if (!record) {
      await transaction.rollback();

      return res.status(404).json({
        message: "Record not found"
      });
    }

    if (record.status === "returned") {
      await transaction.rollback();

      return res.status(409).json({
        message: "Book has already been returned"
      });
    }

    const returnDate = return_date || new Date();

    if (new Date(returnDate) < new Date(record.issue_date)) {
      await transaction.rollback();

      return res.status(400).json({
        message: "Return date cannot be before issue date"
      });
    }

    await record.update(
      {
        return_date: returnDate,
        status: "returned"
      },
      {
        transaction
      }
    );

    await record.bookCopy.update(
      {
        status: "available"
      },
      {
        transaction
      }
    );

    await transaction.commit();

    const updatedRecord = await Record.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "username", "email"]
        },
        {
          model: BookCopy,
          as: "bookCopy",
          attributes: ["id", "status"],
          include: {
            model: Book,
            as: "book",
            attributes: ["id", "isbn", "title", "author"]
          }
        },
        {
          model: Payment,
          as: "payments"
        }
      ]
    });

    return res.status(200).json(updatedRecord);
  } catch (error) {
    await transaction.rollback();

    console.error(error);

    return res.status(500).json({
      message: "Failed to return book"
    });
  }
};

const deleteRecord = async (req, res) => {
  const transaction = await Record.sequelize.transaction();

  try {
    const { id } = req.params;

    const record = await Record.findByPk(id, {
      include: {
        model: BookCopy,
        as: "bookCopy"
      },
      transaction
    });

    if (!record) {
      await transaction.rollback();

      return res.status(404).json({
        message: "Record not found"
      });
    }

    // If the book is still issued, make the copy available
    if (record.status === "issued") {
      await record.bookCopy.update(
        {
          status: "available"
        },
        {
          transaction
        }
      );
    }

    await record.destroy({
      transaction
    });

    await transaction.commit();

    return res.status(200).json({
      message: "Record deleted successfully"
    });
  } catch (error) {
    await transaction.rollback();

    console.error(error);

    return res.status(500).json({
      message: "Failed to delete record"
    });
  }
};

module.exports = {
  createRecord,
  getRecords,
  getRecord,
  updateRecord,
  deleteRecord
};