"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("roles", [
      {
        name: "Librarian",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Student",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Faculty",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("roles", {
      name: ["Librarian", "Student", "Faculty"]
    });
  }
};