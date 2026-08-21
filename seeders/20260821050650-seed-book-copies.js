"use strict";

module.exports = {
  async up(queryInterface) {
    const [books] = await queryInterface.sequelize.query(
      `SELECT id, isbn FROM books`
    );

    const bookIds = {};

    books.forEach((book) => {
      bookIds[book.isbn] = book.id;
    });

    await queryInterface.bulkInsert("book_copies", [
      {
        book_id: bookIds["9780132350884"],
        status: "available",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        book_id: bookIds["9780132350884"],
        status: "available",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        book_id: bookIds["9780132350884"],
        status: "available",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        book_id: bookIds["9781491950296"],
        status: "available",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        book_id: bookIds["9781491950296"],
        status: "available",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        book_id: bookIds["9781617294945"],
        status: "available",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        book_id: bookIds["9781617294945"],
        status: "available",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        book_id: bookIds["9780134685991"],
        status: "available",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        book_id: bookIds["9781492056355"],
        status: "available",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        book_id: bookIds["9781492056355"],
        status: "available",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("book_copies", null, {});
  }
};