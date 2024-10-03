const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Inventory = require("../models/inv.models");

const inv = express.Router();

inv.get("/", async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "", status } = req.query;

        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);

        let filter = {};

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
            ];
        }

        if (status) {
            filter.status = status;
        }

        const data = await Inventory.find(filter)
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum);

        const totalItems = await Inventory.countDocuments(filter);

        res.json({
            success: true,
            data: data,
            currentPage: pageNum,
            totalPages: Math.ceil(totalItems / limitNum),
            totalItems: totalItems,
            error: false,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching inventory data",
            error: true,
        });
    }
});

inv.post("/", async (req, res) => {
    const newInventoryItem = new Inventory(req.body);
    const savedItem = await newInventoryItem.save();

    res.json({
        success: true,
        data: savedItem,
        error: false,
    });
});

module.exports = inv;
