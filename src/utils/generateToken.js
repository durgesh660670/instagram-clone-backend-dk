const jwt = require("jsonwebtoken");
require('dotenv').config();
const JWT_SECRET_ACCESS = process.env.JWT_SECRET_ACCESS;
const JWT_SECRET_REFRESH = process.env.JWT_SECRET_REFRESH;
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY

const generateAccessToken = (user) => {
  return jwt.sign(
    { username: user.username, role: user.role, _id: user._id },
    JWT_SECRET_ACCESS,
    { expiresIn: TOKEN_EXPIRY }
  );
};
const generateRefreshToken = (user) => {
  return jwt.sign(
    { username: user.username, role: user.role, _id: user._id },
    JWT_SECRET_REFRESH,
  );
};

module.exports = { generateAccessToken, generateRefreshToken };
