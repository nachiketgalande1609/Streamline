const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Inventory = require("../models/inv.models");
const Suppliers = require("../models/suppliers.models");

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

inv.get("/options", async (req, res) => {
    try {
        const statuses = ["in stock", "out of stock", "discontinued"];
        const suppliers = await Suppliers.find().select("name");
        const categories = await Inventory.distinct("category");
        res.json({
            success: true,
            data: { statuses: statuses, suppliers: suppliers, categories: categories },
            error: false,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            data: [],
            error: true,
            message: "Error fetching options.",
        });
    }
});

inv.patch("/bulk-edit", async (req, res) => {
    try {
        const { ids, ...updateData } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid request: 'ids' must be a non-empty array.",
                error: true,
            });
        }

        // Filter out fields that are null, undefined, or empty strings
        const filteredUpdateData = Object.fromEntries(
            Object.entries(updateData).filter(([, value]) => value !== null && value !== undefined && value !== "")
        );

        if (Object.keys(filteredUpdateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid fields to update.",
                error: true,
            });
        }

        // Update only the valid fields in the inventory items
        const result = await Inventory.updateMany({ _id: { $in: ids } }, { $set: filteredUpdateData });

        if (result.modifiedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "No inventory items were updated.",
                error: true,
            });
        }

        res.json({
            success: true,
            data: {
                modifiedCount: result.modifiedCount,
                message: "Inventory items updated successfully.",
            },
            error: false,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating inventory data",
            error: true,
        });
    }
});

module.exports = inv;
