const express = require("express");

const router = express.Router();

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getToken,
  refreshToken,
  logout
} = require("../controllers/userController");

const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

// Public authentication routes
router.post("/getToken", getToken);
router.post("/refreshToken", refreshToken);

// Protected routes
router.get(
  "/",
  authenticate,
  authorize("Librarian"),
  getUsers
);

router.get(
  "/:id",
  authenticate,
  authorize("Librarian"),
  getUser
);

router.post(
  "/",
  authenticate,
  authorize("Librarian"),
  createUser
);

router.put(
  "/:id",
  authenticate,
  authorize("Librarian"),
  updateUser
);

router.delete(
  "/:id",
  authenticate,
  authorize("Librarian"),
  deleteUser
);

router.post("/logout", authenticate, logout);

module.exports = router;