const bcrypt = require("bcrypt");
const User = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");
const {customLogger}=require("../middleware/logger")
require('dotenv').config()


const signup = async (req, res) => {
  try {
    const data = req.body;
    const { username, password, email } = data;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Check if user with same username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({
        status: 'unsuccess',
        message: 'User with the same username or email already exists',
      });
    }

    const createduser = new User({
      username: username,
      password: hashedPassword,
      email: email,
    });
    const saveuser = await createduser.save();
    res.status(200).send({
      status: "success",
      message: "User has been successfully Registered!",
      data: {
        user: username,
      },
    });
  } catch (e) {
    customLogger.info("signup -"+e.stack)
    res.status(500).send({
      status: "unsuccess",
      message: "Error while signup",
    });
  }
};
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(401).send({
        status: "unsuccess",
        message: "user does not exist",
      });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).send({
        status: "unsuccess",
        message: "password is incorrect",
      });
    }
    const accessToken = generateToken.generateAccessToken(user);
    const refreshToken = generateToken.generateRefreshToken(user);
    await User.findByIdAndUpdate(user._id, {
      jwtToken: refreshToken,
    });
    const { password: PassWord, jwtToken, ...other } = user._doc;

    res.status(200).send({
      status: "success",
      message: "logged in successfully",
      data: other,
      accessToken,
      refreshToken,
    });
  } catch (e) {
    customLogger.info("login -"+e.stack)
    res.status(500).send({
      status: "unsuccess",
      message: "Error while login",
    });
  }
};
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).send({
        status: "unsuccess",
        message: "logout error",
      });
    }

    await User.updateOne({ jwtToken: refreshToken }, [
      { $set: { jwtToken: null } },
    ]);
    res.status(200).send({
      status: "success",
      message: "You've been logged out",
    });


  } catch (e) {
    customLogger.info("logout -"+e.stack)
    res.status(500).send({
      status: "unsuccess",
      message: "Error while logout",
    });
  }
};

const refresh = async (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) {
   return  res.status(401).send({
      status: "unsuccess",
      message: "You are not authenticated!",
    });
  }
  try {
    const token = await User.findOne(
      { jwtToken: refreshToken },
      { jwtToken: true }
    );
    if (!token) {
      return res.status(401).send({
        status: "unsuccess",
        message: "Refresh token is not valid!",
      });
    }
    jwt.verify(
      refreshToken,
      process.env.JWT_SECRET_REFRESH,
      async (err, user) => {
        if (err) {
          return res.status(401).json({ message: 'Invalid refresh token' });
        }

        const newAccessToken = generateToken.generateAccessToken(user);
        const newRefreshToken = generateToken.generateRefreshToken(user);
        await User.updateOne(
          { jwtToken: refreshToken },
          { $set: { jwtToken: newRefreshToken } }
        );
        res.status(200).json({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });
      }
    );
  } catch (e) {
    customLogger.info("Refresh token -"+e.stack)
    res.status(500).send({
      status: "unsuccess",
      message: "Error while generating or verifying refresh token",
    });
  }
};

module.exports = {
  signup,
  login,
  logout,
  refresh,
};
