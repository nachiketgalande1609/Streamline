const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Warehouse = require("../models/warehouse.models");

const warehouse = express.Router();

warehouse.get("/", async (req, res) => {
    const warehouses = await Warehouse.find().select("name");
    res.json({
        success: true,
        data: warehouses,
        error: false,
    });
});

module.exports = warehouse;
