"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Record extends Model {
    static associate(models) {
      Record.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user"
      });

      Record.belongsTo(models.BookCopy, {
        foreignKey: "book_copy_id",
        as: "bookCopy"
      });

      Record.hasMany(models.Payment, {
        foreignKey: "record_id",
        as: "payments"
      });
    }
  }

  Record.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      book_copy_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      issue_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      due_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      return_date: {
        type: DataTypes.DATE,
        allowNull: true
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "issued"
      }
    },
    {
      sequelize,
      modelName: "Record",
      tableName: "records"
    }
  );

  return Record;
};