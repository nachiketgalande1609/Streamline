const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

const user = express.Router();

user.get("/", async (req, res) => {
    const data = await User.find();
    res.json({
        success: true,
        data: data,
        error: false,
    });
});

module.exports = user;
