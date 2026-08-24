const { Op } = require("sequelize");

const {
  User,
  Book,
  BookCopy,
  Record,
  LoginLog
} = require("../models");

const getStatistics = async (req, res) => {
  try {
    const { from, to } = req.query;

    // -----------------------------------
    // Validate timespan
    // -----------------------------------

    let startDate = null;
    let endDate = null;

    if (from) {
      startDate = new Date(from);

      if (isNaN(startDate.getTime())) {
        return res.status(400).json({
          message: "Invalid 'from' date"
        });
      }
    }

    if (to) {
      endDate = new Date(to);

      if (isNaN(endDate.getTime())) {
        return res.status(400).json({
          message: "Invalid 'to' date"
        });
      }

      // Include the entire 'to' day
      endDate.setHours(23, 59, 59, 999);
    }

    if (startDate && endDate && startDate > endDate) {
      return res.status(400).json({
        message: "'from' date cannot be after 'to' date"
      });
    }

    // -----------------------------------
    // Build date conditions
    // -----------------------------------

    const recordDateWhere = {};

    if (startDate && endDate) {
      recordDateWhere.issue_date = {
        [Op.between]: [startDate, endDate]
      };
    } else if (startDate) {
      recordDateWhere.issue_date = {
        [Op.gte]: startDate
      };
    } else if (endDate) {
      recordDateWhere.issue_date = {
        [Op.lte]: endDate
      };
    }

    const bookDateWhere = {};

    if (startDate && endDate) {
      bookDateWhere.createdAt = {
        [Op.between]: [startDate, endDate]
      };
    } else if (startDate) {
      bookDateWhere.createdAt = {
        [Op.gte]: startDate
      };
    } else if (endDate) {
      bookDateWhere.createdAt = {
        [Op.lte]: endDate
      };
    }

    // -----------------------------------
    // Total users
    // -----------------------------------

    const totalUsers = await User.count();

    // -----------------------------------
    // Total books
    // -----------------------------------

    const totalBooks = await Book.count({
      where: bookDateWhere
    });

    // -----------------------------------
    // Total currently lent books
    // -----------------------------------

    const totalLentBooks = await Record.count({
      where: {
        status: "issued",
        ...recordDateWhere
      }
    });

    // -----------------------------------
    // Highest lent book
    // -----------------------------------

    const [highestLentBook] = await Book.findAll({
      attributes: [
        "id",
        "title",
        "isbn",
        "author",
        [
          Book.sequelize.fn(
            "COUNT",
            Book.sequelize.col("copies->records.id")
          ),
          "lentCount"
        ]
      ],

      include: {
        model: BookCopy,
        as: "copies",
        attributes: [],

        include: {
          model: Record,
          as: "records",
          attributes: [],
          where:
            Object.keys(recordDateWhere).length > 0
              ? recordDateWhere
              : undefined,
          required: false
        }
      },

      group: ["Book.id"],

      order: [
        [Book.sequelize.literal('"lentCount"'), "DESC"]
      ],

      limit: 1,
      subQuery: false
    });

    // -----------------------------------
    // Most active user
    // Based on LOGIN COUNT
    // -----------------------------------

    const loginDateWhere = {};

    if (startDate && endDate) {
      loginDateWhere.login_at = {
        [Op.between]: [startDate, endDate]
      };
    } else if (startDate) {
      loginDateWhere.login_at = {
        [Op.gte]: startDate
      };
    } else if (endDate) {
      loginDateWhere.login_at = {
        [Op.lte]: endDate
      };
    }

    const [mostActiveUser] = await User.findAll({
      attributes: [
        "id",
        "name",
        "username",
        [
          User.sequelize.fn(
            "COUNT",
            User.sequelize.col("loginLogs.id")
          ),
          "loginCount"
        ]
      ],

      include: {
        model: LoginLog,
        as: "loginLogs",
        attributes: [],
        where:
          Object.keys(loginDateWhere).length > 0
            ? loginDateWhere
            : undefined,
        required: false
      },

      group: ["User.id"],

      order: [
        [User.sequelize.literal('"loginCount"'), "DESC"]
      ],

      limit: 1,
      subQuery: false
    });

    // -----------------------------------
    // Oldest book
    // -----------------------------------

    const oldestBook = await Book.findOne({
      where: bookDateWhere,

      order: [["createdAt", "ASC"]],

      attributes: [
        "id",
        "title",
        "isbn",
        "author",
        "createdAt"
      ]
    });

    // -----------------------------------
    // Newest book
    // -----------------------------------

    const newestBook = await Book.findOne({
      where: bookDateWhere,

      order: [["createdAt", "DESC"]],

      attributes: [
        "id",
        "title",
        "isbn",
        "author",
        "createdAt"
      ]
    });

    // -----------------------------------
    // Most available book
    // -----------------------------------

    const [mostAvailableBook] = await Book.findAll({
      attributes: [
        "id",
        "title",
        "isbn",
        "author",
        [
          Book.sequelize.fn(
            "COUNT",
            Book.sequelize.col("copies.id")
          ),
          "availableCopies"
        ]
      ],

      where: bookDateWhere,

      include: {
        model: BookCopy,
        as: "copies",
        attributes: [],

        where: {
          status: "available"
        },

        required: false
      },

      group: ["Book.id"],

      order: [
        [Book.sequelize.literal('"availableCopies"'), "DESC"]
      ],

      limit: 1,
      subQuery: false
    });

    // -----------------------------------
    // Response
    // -----------------------------------

    res.status(200).json({
      timespan: {
        from: from || null,
        to: to || null
      },

      totalUsers,
      totalBooks,
      totalLentBooks,
      highestLentBook: highestLentBook || null,
      mostActiveUser: mostActiveUser || null,
      oldestBook: oldestBook || null,
      newestBook: newestBook || null,
      mostAvailableBook: mostAvailableBook || null
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch statistics"
    });
  }
};

module.exports = {
  getStatistics
};
