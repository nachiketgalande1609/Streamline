const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

const auth = express.Router();

auth.post("/register", async (req, res) => {
  try {
    const hashed_pwd = await bcrypt.hash(req.body.password, 10);
    await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashed_pwd,
    });
    res.json({
      success: true,
      data: "User Created Successfully",
      error: false,
    });
  } catch (error) {
    res.json({
      success: false,
      data: "User Already Exists",
      error: true,
    });
  }
});

auth.post("/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    res.json({
      success: false,
      data: "User not Found",
      error: true,
      user: false,
    });
  }

  const is_password_valid = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (is_password_valid) {
    const token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      "secret123"
    );
    res.json({
      success: true,
      data: "Logged In Successfully",
      error: false,
      user: token,
    });
  } else {
    res.json({
      success: false,
      data: "Login Failed",
      error: true,
      user: false,
    });
  }
});

auth.post("/logout", (req, res) => {
  res.json({
    success: true,
    data: "Logged Out Successfully",
    error: false,
    user: false,
  });
});

module.exports = auth;
