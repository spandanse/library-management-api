"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("revoked_tokens", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },

      jti: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true
      },

      expires_at: {
        type: Sequelize.DATE,
        allowNull: false
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("revoked_tokens");
  }
};