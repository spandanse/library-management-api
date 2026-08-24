const { RevokedToken } = require("../models");
const { verifyAccessToken } = require("../utils/jwt");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Access token is required"
      });
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        message: "Invalid authorization header"
      });
    }

    const decoded = verifyAccessToken(token);

    const revokedToken = await RevokedToken.findOne({
      where: {
        jti: decoded.jti,
        token_type: "access"
      }
    });

    if (revokedToken) {
      return res.status(401).json({
        message: "Access token has been revoked"
      });
    }

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired access token"
    });
  }
};

module.exports = authenticate;