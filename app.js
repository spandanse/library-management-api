const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");
const bookCopyRoutes = require("./routes/bookCopyRoutes");
const recordRoutes = require("./routes/recordRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const statisticsRoutes = require("./routes/statisticsRoutes");

const app = express();

const logDirectory = path.join(__dirname, "logs");

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const accessLogStream = fs.createWriteStream(
  path.join(logDirectory, "access.log"),
  { flags: "a" }
);

app.use(helmet());
app.use(cors());
app.use(morgan("combined", { stream: accessLogStream }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Library Management API is running"
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Library API is running"
  });
});

app.use("/users", userRoutes);
app.use("/books", bookRoutes);
app.use("/book-copies", bookCopyRoutes);
app.use("/records", recordRoutes);
app.use("/payments", paymentRoutes);
app.use("/statistics", statisticsRoutes);

module.exports = app;