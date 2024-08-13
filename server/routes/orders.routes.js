const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Orders = require("../models/orders.models");

const orders = express.Router();

orders.get("/", async (req, res) => {
    const data = await Orders.find();
    res.json({
        success: true,
        data: data,
        error: false,
    });
});

module.exports = orders;
