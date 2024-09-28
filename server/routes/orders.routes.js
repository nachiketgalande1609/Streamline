const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Orders = require("../models/orders.models");

const orders = express.Router();

orders.get("/", async (req, res) => {
    const { status } = req.query;
    const query = status ? { status } : {};

    try {
        const data = await Orders.aggregate([
            {
                $match: query, // Filter based on the order status, if provided.
            },
            {
                $lookup: {
                    from: "customer-data", // Name of the Customers collection
                    localField: "customerId", // Field in Orders collection
                    foreignField: "_id", // Field in Customers collection
                    as: "customerInfo", // The field to which the joined data will be assigned
                },
            },
            {
                $unwind: "$customerInfo", // Unwind to deconstruct the customerInfo array
            },
            {
                $project: {
                    _id: 1,
                    orderId: 1,
                    orderDate: 1,
                    shippingDate: 1,
                    status: 1,
                    totalAmount: 1,
                    taxAmount: 1,
                    discount: 1,
                    netAmount: 1,
                    paymentMethod: 1,
                    paymentStatus: 1,
                    paymentDate: 1,
                    shippingAddress: 1,
                    billingAddress: 1,
                    items: 1,
                    createdBy: 1,
                    updatedBy: 1,
                    notes: 1,
                    "customerInfo.customer_name": 1,
                    "customerInfo.contact_number": 1,
                    "customerInfo.email": 1,
                },
            },
        ]);

        res.json({
            success: true,
            data: data,
            error: false,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            data: [],
            error: true,
            message: "Error fetching order data.",
        });
    }
});

orders.get("/status", async (req, res) => {
    try {
        const statuses = ["pending", "shipped", "delivered", "cancelled"];
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
            message: "Error fetching statuses.",
        });
    }
});

module.exports = orders;
