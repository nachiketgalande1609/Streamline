const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Sales = require("../models/sales.model");

const sales = express.Router();

sales.get("/", async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const totalCount = await Sales.countDocuments();

        const salesData = await Sales.find()
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .exec();

        res.json({
            success: true,
            data: salesData,
            totalCount,
            error: false,
        });
    } catch (err) {
        console.error("Error fetching sales data:", err);
        res.status(500).json({
            success: false,
            data: null,
            error: err.message,
        });
    }
});

module.exports = sales;
