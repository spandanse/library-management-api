const express = require("express");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require("../controllers/userController");

const validateUser = require("../middleware/validateUser");

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", validateUser, createUser);
router.put("/:id", validateUser, updateUser);
router.delete("/:id", deleteUser);

module.exports = router;