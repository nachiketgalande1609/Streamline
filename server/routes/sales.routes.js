const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Sales = require("../models/user.model");

const sales = express.Router();

sales.get("/", async (req, res) => {
    const data = await Sales.find();
    res.json({
        success: true,
        data: data,
        error: false,
    });
});

module.exports = user;
