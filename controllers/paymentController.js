const { Payment, Record, User, BookCopy, Book } = require("../models");

const getPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: {
        model: Record,
        as: "record",
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
          }
        ]
      },
      order: [["id", "ASC"]]
    });

    res.status(200).json(payments);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch payments"
    });
  }
};

const getPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByPk(id, {
      include: {
        model: Record,
        as: "record",
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
          }
        ]
      }
    });

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found"
      });
    }

    res.status(200).json(payment);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch payment"
    });
  }
};

const createPayment = async (req, res) => {
  try {
    const {
      record_id,
      amount,
      payment_date,
      payment_method,
      status
    } = req.body;

    const record = await Record.findByPk(record_id);

    if (!record) {
      return res.status(404).json({
        message: "Record not found"
      });
    }

    const payment = await Payment.create({
      record_id,
      amount,
      payment_date,
      payment_method,
      status
    });

    const createdPayment = await Payment.findByPk(payment.id, {
      include: {
        model: Record,
        as: "record",
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
          }
        ]
      }
    });

    res.status(201).json(createdPayment);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create payment"
    });
  }
};

const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByPk(id);

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found"
      });
    }

    const {
      amount,
      payment_date,
      payment_method,
      status
    } = req.body;

    await payment.update({
      amount,
      payment_date,
      payment_method,
      status
    });

    const updatedPayment = await Payment.findByPk(id, {
      include: {
        model: Record,
        as: "record",
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
          }
        ]
      }
    });

    res.status(200).json(updatedPayment);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update payment"
    });
  }
};

const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByPk(id);

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found"
      });
    }

    await payment.destroy();

    res.status(200).json({
      message: "Payment deleted successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete payment"
    });
  }
};

module.exports = {
  getPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment
};