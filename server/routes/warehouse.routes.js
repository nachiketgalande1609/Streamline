const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Warehouse = require("../models/warehouse.models");

const warehouse = express.Router();

warehouse.get("/", async (req, res) => {
    const { status, page = 1, limit = 10 } = req.query;
    const query = status ? { status } : {};

    try {
        const aggregateQuery = [
            { $match: query },
            {
                $lookup: {
                    from: "user-data",
                    localField: "manager_id",
                    foreignField: "_id",
                    as: "managerInfo",
                },
            },
            {
                $unwind: {
                    path: "$managerInfo",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    warehouse_id: 1,
                    name: 1,
                    location: 1,
                    capacity: 1,
                    current_stock: 1,
                    contact_number: 1,
                    status: 1,
                    "managerInfo.first_name": 1,
                    "managerInfo.last_name": 1,
                    "managerInfo.email": 1,
                    "managerInfo.phone_number": 1,
                },
            },
            {
                $facet: {
                    data: [{ $skip: (page - 1) * limit }, { $limit: parseInt(limit) }],
                    totalCount: [{ $count: "count" }],
                },
            },
            {
                $unwind: "$totalCount",
            },
            {
                $project: {
                    data: "$data",
                    totalCount: "$totalCount.count",
                },
            },
        ];

        const result = await Warehouse.aggregate(aggregateQuery);

        res.json({
            success: true,
            data: result.length > 0 ? result[0].data : [], // Return empty array if no data
            totalCount: result.length > 0 ? result[0].totalCount : 0, // Return the total count
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

warehouse.post("/", async (req, res) => {
    const { warehouse_id, name, location, capacity, current_stock, contact_number, status, manager_id } = req.body;

    try {
        const existingWarehouse = await Warehouse.findOne({ warehouse_id });

        if (existingWarehouse) {
            return res.status(400).json({
                success: false,
                error: true,
                message: "Warehouse ID already exists.",
            });
        }

        const newWarehouse = new Warehouse({
            warehouse_id,
            name,
            location,
            capacity,
            contact_number,
            status,
            manager_id,
        });

        await newWarehouse.save();

        res.json({
            success: true,
            data: newWarehouse,
            error: false,
            message: "Warehouse created successfully.",
        });
    } catch (error) {
        console.error("Error creating warehouse:", error);
        res.status(500).json({
            success: false,
            data: [],
            error: true,
            message: "Error creating warehouse.",
        });
    }
});

module.exports = warehouse;
