const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Warehouse = require("../models/warehouse.models");

const warehouse = express.Router();

warehouse.get("/", async (req, res) => {
    const { status } = req.query;
    const query = status ? { status } : {};
    try {
        const warehouses = await Warehouse.find(query);
        res.json({
            success: true,
            data: warehouses,
            error: false,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            data: [],
            error: true,
            message: "Error fetching status data.",
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
