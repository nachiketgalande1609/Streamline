const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Warehouse = require("../models/warehouse.models");
const Order = require("../models/orders.models");

const dashboard = express.Router();

dashboard.get("/", async (req, res) => {
    const userCount = await User.countDocuments();
    const warehouseCount = await Warehouse.countDocuments();
    const orderCount = await Order.countDocuments();
    res.json({
        success: true,
        data: {
            userCount,
            warehouseCount,
            orderCount,
        },
        error: false,
    });
});

module.exports = dashboard;
