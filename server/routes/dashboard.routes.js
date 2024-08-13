const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Warehouse = require("../models/warehouse.models");

const dashboard = express.Router();

dashboard.get("/", async (req, res) => {
    const data = await Warehouse.find(
        {},
        "warehouse_id name capacity current_stock"
    );
    res.json({
        success: true,
        data: data,
        error: false,
    });
});

module.exports = dashboard;
