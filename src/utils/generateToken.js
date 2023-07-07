const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign(
    { username: user.username, role: user.role, _id: user._id },
    "kumardurgesh",
    { expiresIn: "300s" }
  );
};
const generateRefreshToken = (user) => {
  return jwt.sign(
    { username: user.username, role: user.role, _id: user._id },
    "kumardurgesh123",
  );
};

module.exports = { generateAccessToken, generateRefreshToken };
