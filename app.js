const express = require("express");
const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");
const bookCopyRoutes = require("./routes/bookCopyRoutes");
const recordRoutes = require("./routes/recordRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const statisticsRoutes = require("./routes/statisticsRoutes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Library Management API is running"
  });
});

app.use("/users", userRoutes);
app.use("/books", bookRoutes);
app.use("/book-copies", bookCopyRoutes);
app.use("/records", recordRoutes);
app.use("/payments", paymentRoutes);
app.use("/statistics", statisticsRoutes);

module.exports = app;