const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Sales = require("../models/sales.model");

const sales = express.Router();

sales.get("/", async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const aggregateQuery = [
            {
                $lookup: {
                    from: "customer-data", // Collection to join
                    localField: "customerId", // Field from the Sales collection
                    foreignField: "_id", // Field from the Customers collection
                    as: "customerInfo", // Output array field name for customer info
                },
            },
            {
                $unwind: {
                    path: "$customerInfo", // Unwind the customer info array to get individual documents
                    preserveNullAndEmptyArrays: true, // If no match is found, still include the sales record with null customer info
                },
            },
            {
                $project: {
                    _id: 1,
                    orderNumber: 1,
                    totalAmount: 1,
                    paymentStatus: 1,
                    orderStatus: 1,
                    createdAt: 1,
                    items: 1,
                    "customerInfo.customer_name": 1, // Selecting specific customer fields
                    "customerInfo.contact_number": 1,
                    "customerInfo.email": 1,
                },
            },
            {
                $facet: {
                    data: [
                        { $skip: (page - 1) * limit }, // Pagination: skip records
                        { $limit: parseInt(limit) }, // Limit the number of records returned
                    ],
                    totalCount: [
                        { $count: "count" }, // Count total matching sales records
                    ],
                },
            },
            {
                $unwind: "$totalCount", // Unwind the total count for easier access
            },
            {
                $project: {
                    data: "$data",
                    totalCount: "$totalCount.count", // Extract total count
                },
            },
        ];

        const result = await Sales.aggregate(aggregateQuery);

        res.json({
            success: true,
            data: result.length > 0 ? result[0].data : [], // If no data, return empty array
            totalCount: result.length > 0 ? result[0].totalCount : 0, // Total count of sales
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
