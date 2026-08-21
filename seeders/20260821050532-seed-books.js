"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("books", [
      {
        isbn: "9780132350884",
        title: "Clean Code",
        author: "Robert C. Martin",
        subject: "Programming",
        publication_date: "2008-08-01",
        description: "A guide to writing clean and maintainable code.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        isbn: "9781491950296",
        title: "Designing Data-Intensive Applications",
        author: "Martin Kleppmann",
        subject: "Database",
        publication_date: "2017-03-16",
        description: "Principles and practical techniques for data-intensive systems.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        isbn: "9781617294945",
        title: "Node.js Design Patterns",
        author: "Mario Casciaro",
        subject: "Programming",
        publication_date: "2020-05-01",
        description: "Design patterns and best practices for Node.js applications.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        isbn: "9780134685991",
        title: "Effective Java",
        author: "Joshua Bloch",
        subject: "Programming",
        publication_date: "2018-01-06",
        description: "Best practices for Java programming.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        isbn: "9781492056355",
        title: "Learning PostgreSQL",
        author: "Korry Douglas",
        subject: "Database",
        publication_date: "2021-01-01",
        description: "An introduction to PostgreSQL database development.",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("books", {
      isbn: [
        "9780132350884",
        "9781491950296",
        "9781617294945",
        "9780134685991",
        "9781492056355"
      ]
    });
  }
};