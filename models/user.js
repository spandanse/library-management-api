"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Role, {
        foreignKey: "role_id",
        as: "role"
      });

      User.hasMany(models.Record, {
        foreignKey: "user_id",
        as: "records"
      });

      User.hasMany(models.LoginLog, {
        foreignKey: "user_id",
        as: "loginLogs"
      });
    }
  }

  User.init(
    {
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      registration_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      login_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
}
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users"
    }
  );

  return User;
};