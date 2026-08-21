"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("users", [
      {
        role_id: 1,
        name: "Library Admin",
        username: "librarian",
        email: "librarian@library.com",
        password: await bcrypt.hash("Librarian@123", 10),
        phone: "9876543210",
        registration_date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: 2,
        name: "Amit Sharma",
        username: "amit",
        email: "amit@library.com",
        password: await bcrypt.hash("Amit@123", 10),
        phone: "9876543211",
        registration_date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: 2,
        name: "Priya Das",
        username: "priya",
        email: "priya@library.com",
        password: await bcrypt.hash("Priya@123", 10),
        phone: "9876543212",
        registration_date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: 3,
        name: "Rahul Sen",
        username: "rahul",
        email: "rahul@library.com",
        password: await bcrypt.hash("Rahul@123", 10),
        phone: "9876543213",
        registration_date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        role_id: 3,
        name: "Neha Roy",
        username: "neha",
        email: "neha@library.com",
        password: await bcrypt.hash("Neha@123", 10),
        phone: "9876543214",
        registration_date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("users", {
      username: [
        "librarian",
        "amit",
        "priya",
        "rahul",
        "neha"
      ]
    });
  }
};