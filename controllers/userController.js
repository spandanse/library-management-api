const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

const {
  User,
  Role,
  RevokedToken,
  LoginLog
} = require("../models");

const {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
} = require("../utils/jwt");

const getUsers = async (req, res) => {
  try {
    const {
      search = {},
      filter = {},
      sort = {}
    } = req.body || {};

    const where = {};

    // Search by user name
    if (search.name) {
      where.name = {
        [Op.iLike]: `%${search.name}%`
      };
    }

    // Filter by role/category
    const roleWhere = {};

    if (filter.category) {
      roleWhere.name = {
        [Op.iLike]: `%${filter.category}%`
      };
    }

    // Allowed sorting
    const order = [];

    if (sort.name) {
      const direction =
        sort.name.toLowerCase() === "desc"
          ? "DESC"
          : "ASC";

      order.push(["name", direction]);
    }

    if (sort.registration_date) {
      const direction =
        sort.registration_date.toLowerCase() === "desc"
          ? "DESC"
          : "ASC";

      order.push(["registration_date", direction]);
    }

    // Default sorting
    if (order.length === 0) {
      order.push(["id", "ASC"]);
    }

    const users = await User.findAll({
      where,

      attributes: {
        exclude: ["password"]
      },

      include: {
        model: Role,
        as: "role",
        attributes: ["id", "name"],
        where:
          Object.keys(roleWhere).length > 0
            ? roleWhere
            : undefined
      },

      order
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
};

const updateUser = async (req, res) => {
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

const getToken = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      where: {
        username
      },
      include: {
        model: Role,
        as: "role"
      }
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password"
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid username or password"
      });
    }

    // Successful login
    await user.increment("login_count");

    // Store individual login event for timespan statistics
    await LoginLog.create({
      user_id: user.id
    });

    // Reload user so the updated login count is available
    await user.reload();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to generate token"
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Refresh token is required"
      });
    }

    const decoded = verifyRefreshToken(token);

    const revokedToken = await RevokedToken.findOne({
      where: {
        jti: decoded.jti,
        token_type: "refresh"
      }
    });

    if (revokedToken) {
      return res.status(401).json({
        message: "Refresh token has been revoked"
      });
    }

    const user = await User.findByPk(decoded.id, {
      include: {
        model: Role,
        as: "role"
      }
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const accessToken = generateAccessToken(user);

    res.status(200).json({
      accessToken
    });
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      message: "Invalid or expired refresh token"
    });
  }
};

const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access token required"
      });
    }

    const accessToken = authHeader.split(" ")[1];

    const decodedAccessToken = verifyAccessToken(accessToken);

    await RevokedToken.create({
      jti: decodedAccessToken.jti,
      expires_at: new Date(decodedAccessToken.exp * 1000),
      token_type: "access"
    });

    const { refreshToken } = req.body;

    if (refreshToken) {
      const decodedRefreshToken = verifyRefreshToken(refreshToken);

      await RevokedToken.create({
        jti: decodedRefreshToken.jti,
        expires_at: new Date(decodedRefreshToken.exp * 1000),
        token_type: "refresh"
      });
    }

    res.status(200).json({
      message: "Logout successful"
    });
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getToken,
  refreshToken,
  logout
};

