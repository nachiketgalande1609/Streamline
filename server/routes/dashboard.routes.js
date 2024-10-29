const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Warehouse = require("../models/warehouse.models");
const Order = require("../models/orders.models");
const Customer = require("../models/customers.models");
const Ticket = require("../models/tickets.models");

const dashboard = express.Router();

dashboard.get("/", async (req, res) => {
    const userCount = await User.countDocuments();
    const warehouseCount = await Warehouse.countDocuments();
    const orderCount = await Order.countDocuments();
    const customerCount = await Customer.countDocuments();
    const warehouses = await Warehouse.find({}, "warehouse_id current_stock capacity status");
    const ticketCount = await Ticket.countDocuments();

    res.json({
        success: true,
        data: {
            userCount,
            warehouseCount,
            orderCount,
            customerCount,
            ticketCount,
            warehouse_summary: warehouses.map((warehouse) => ({
                warehouse_id: warehouse.warehouse_id,
                currentStock: warehouse.current_stock,
                capacity: warehouse.capacity,
                status: warehouse.status,
            })),
        },
        error: false,
    });
});

module.exports = dashboard;
