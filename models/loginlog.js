"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class LoginLog extends Model {
    static associate(models) {
      LoginLog.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user"
      });
    }
  }

  LoginLog.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },

      login_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      modelName: "LoginLog",
      tableName: "login_logs"
    }
  );

  return LoginLog;
};