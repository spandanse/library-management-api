"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      Payment.belongsTo(models.Record, {
        foreignKey: "record_id",
        as: "record"
      });
    }
  }

  Payment.init(
    {
      record_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      payment_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      payment_method: {
        type: DataTypes.STRING(30),
        allowNull: false
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "pending"
      }
    },
    {
      sequelize,
      modelName: "Payment",
      tableName: "payments"
    }
  );

  return Payment;
};