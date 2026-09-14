require("dotenv").config();

const app = require("./app");
const db = require("./models");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await db.sequelize.authenticate();

    console.log("Database connected.");

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);

      if (process.send) {
        process.send("ready");
      }
    });

    let isShuttingDown = false;

    const shutdown = async () => {
      if (isShuttingDown) {
        return;
      }

      isShuttingDown = true;

      console.log("Shutting down server...");

      server.close(async () => {
        try {
          await db.sequelize.close();

          console.log("Database connection closed.");

          process.exit(0);
        } catch (error) {
          console.error("Error closing database:", error);
          process.exit(1);
        }
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();