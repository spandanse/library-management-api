"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RevokedToken extends Model {}

  RevokedToken.init(
    {
      jti: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true
      },

      expires_at: {
        type: DataTypes.DATE,
        allowNull: false
      },

      token_type: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "RevokedToken",
      tableName: "revoked_tokens"
    }
  );

  return RevokedToken;
};