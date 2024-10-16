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
                    data: [
                        { $skip: (page - 1) * limit },
                        { $limit: parseInt(limit) },
                    ],
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

module.exports = warehouse;
