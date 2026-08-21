const { User, Role } = require("../models");

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
    attributes: {
        exclude: ["password"]
    },
    include: {
        model: Role,
        as: "role",
        attributes: ["id", "name"]
    }
    });

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch users"
    });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
    attributes: {
        exclude: ["password"]
    },
    include: {
        model: Role,
        as: "role",
        attributes: ["id", "name"]
    }
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch user"
    });
  }
};

const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  try {
    const {
      role_id,
      name,
      username,
      email,
      password,
      phone
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      role_id,
      name,
      username,
      email,
      password: hashedPassword,
      phone
    });

    const createdUser = await User.findByPk(user.id, {
      attributes: {
        exclude: ["password"]
      },
      include: {
        model: Role,
        as: "role",
        attributes: ["id", "name"]
      }
    });

    res.status(201).json(createdUser);
    } catch (error) {
    console.error(error);

    if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({
        message: "Username or email already exists"
        });
    }

    res.status(500).json({
        message: "Failed to create user"
    });
    }
};const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const {
      role_id,
      name,
      username,
      email,
      password,
      phone
    } = req.body;

    const updateData = {
      role_id,
      name,
      username,
      email,
      phone
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await user.update(updateData);

    const updatedUser = await User.findByPk(id, {
      attributes: {
        exclude: ["password"]
      },
      include: {
        model: Role,
        as: "role",
        attributes: ["id", "name"]
      }
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        message: "Username or email already exists"
      });
    }

    res.status(500).json({
      message: "Failed to update user"
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    await user.destroy();

    res.status(200).json({
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete user"
    });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
};