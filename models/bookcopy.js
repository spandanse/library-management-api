"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class BookCopy extends Model {
    static associate(models) {
      BookCopy.belongsTo(models.Book, {
        foreignKey: "book_id",
        as: "book"
      });

      BookCopy.hasMany(models.Record, {
        foreignKey: "book_copy_id",
        as: "records"
      });
    }
  }

  BookCopy.init(
    {
      book_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "available"
      }
    },
    {
      sequelize,
      modelName: "BookCopy",
      tableName: "book_copies"
    }
  );

  return BookCopy;
};