"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate(models) {
      Book.hasMany(models.BookCopy, {
        foreignKey: "book_id",
        as: "copies"
      });
    }
  }

  Book.init(
    {
      isbn: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      author: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      subject: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      publication_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: "Book",
      tableName: "books"
    }
  );

  return Book;
};