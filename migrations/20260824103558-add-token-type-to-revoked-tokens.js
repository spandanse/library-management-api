"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      "revoked_tokens",
      "token_type",
      {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "access"
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(
      "revoked_tokens",
      "token_type"
    );
  }
};