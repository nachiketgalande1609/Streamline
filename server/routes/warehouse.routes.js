const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Warehouse = require("../models/warehouse.models");

const warehouse = express.Router();

warehouse.get("/", async (req, res) => {
    const { status, page = 1, limit = 10 } = req.query;
    const query = status ? { status } : {};

    try {
        const totalCount = await Warehouse.countDocuments(query);

        const warehouses = await Warehouse.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .exec();

        res.json({
            success: true,
            data: warehouses,
            totalCount,
            error: false,
        });
    } catch (error) {
        console.error("Error fetching warehouse data:", error);
        res.status(500).json({
            success: false,
            data: [],
            error: true,
            message: "Error fetching warehouse data.",
        });
    }
});

warehouse.get("/status", async (req, res) => {
    try {
        const statuses = ["active", "inactive"];
        res.json({
            success: true,
            data: statuses,
            error: false,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            data: [],
            error: true,
            message: "Error fetching roles.",
        });
    }
});

warehouse.get("/lov", async (req, res) => {
    const warehouses = await Warehouse.find().select("warehouse_id");
    res.json({
        success: true,
        data: warehouses,
        error: false,
    });
});

module.exports = warehouse;
