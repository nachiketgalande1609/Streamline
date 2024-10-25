const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Orders = require("../models/orders.models");
const Customer = require("../models/customers.models");
const Inventory = require("../models/inv.models");

const { sendEmail } = require("../utils/utils");

const orders = express.Router();

orders.get("/", async (req, res) => {
    const { status, page = 1, limit = 10 } = req.query; // Get page and limit from query parameters
    const query = status ? { status } : {}; // Filtering based on status

    try {
        const aggregateQuery = [
            { $match: query },
            {
                $lookup: {
                    from: "customer-data",
                    localField: "customerId",
                    foreignField: "_id",
                    as: "customerInfo",
                },
            },
            {
                $unwind: {
                    path: "$customerInfo",
                    preserveNullAndEmptyArrays: true,
                },
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
            // Adding facet for total count and paginated data
            {
                $facet: {
                    data: [
                        { $skip: (page - 1) * limit }, // Skip to the correct page
                        { $limit: parseInt(limit) }, // Limit the number of rows fetched
                    ],
                    totalCount: [
                        { $count: "count" }, // Count the total matching documents
                    ],
                },
            },
            {
                $unwind: "$totalCount", // Unwind total count to access the value directly
            },
            {
                $project: {
                    data: "$data",
                    totalCount: "$totalCount.count", // Access the count
                },
            },
        ];

        const result = await Orders.aggregate(aggregateQuery);
        res.json({
            success: true,
            data: result.length > 0 ? result[0].data : [], // If no data, return an empty array
            totalCount: result.length > 0 ? result[0].totalCount : 0, // Total count of matching orders
            error: false,
        });
    } catch (error) {
        console.error("Error fetching order data:", error); // Log error for debugging
        res.status(500).json({
            success: false,
            data: [],
            error: true,
            message: "Error fetching order data.",
        });
    }
});

orders.post("/", async (req, res) => {
    const {
        customerId,
        customerName,
        customerNumber,
        customerEmail,
        orderDate,
        shippingAddress,
        billingAddress,
        paymentMethod,
        paymentStatus,
        items,
        totalAmount,
        taxAmount,
        netAmount,
    } = req.body;

    // Input validation
    if (
        !customerId ||
        !customerName ||
        !customerNumber ||
        !customerEmail ||
        !orderDate ||
        !shippingAddress ||
        !billingAddress ||
        !paymentMethod ||
        !paymentStatus ||
        !items ||
        !totalAmount ||
        !taxAmount ||
        !netAmount
    ) {
        return res.status(400).json({
            success: false,
            error: true,
            message: "All fields are required.",
        });
    }

    try {
        const generateUniqueOrderId = async () => {
            let uniqueId;
            let isUnique = false;

            while (!isUnique) {
                uniqueId = Math.floor(100000 + Math.random() * 900000);
                const existingOrder = await Orders.findOne({
                    orderId: uniqueId,
                });
                isUnique = !existingOrder;
            }

            return uniqueId;
        };

        // Generate a unique orderId
        const orderId = await generateUniqueOrderId();

        const newOrder = new Orders({
            orderId,
            customerId,
            customerName,
            customerNumber,
            customerEmail,
            orderDate,
            shippingAddress,
            billingAddress,
            paymentMethod,
            paymentStatus,
            items,
            totalAmount,
            taxAmount,
            netAmount,
            status: "pending",
            createdBy: "system",
            updatedBy: "system",
        });

        // Save the order to the database
        const savedOrder = await newOrder.save();

        res.status(201).json({
            success: true,
            data: savedOrder,
            error: false,
            message: "Order created successfully.",
        });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            success: false,
            data: null,
            error: true,
            message: "Error creating order.",
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

orders.get("/customers-items", async (req, res) => {
    try {
        const customerList = await Customer.find(
            {},
            {
                _id: 1,
                customer_name: 1,
                email: 1,
                contact_number: 1,
                address: 1,
            }
        );
        const itemsList = await Inventory.find({}, { _id: 1, name: 1, price: 1 });
        res.json({
            success: true,
            data: { customers: customerList, items: itemsList },
            error: false,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            data: [],
            error: true,
            message: "Error fetching customer data.",
        });
    }
});

orders.get("/:orderId", async (req, res) => {
    const { orderId } = req.params;

    const numericOrderId = Number(orderId);

    try {
        const orderDetails = await Orders.aggregate([
            { $match: { orderId: numericOrderId } },
            {
                $lookup: {
                    from: "customer-data",
                    localField: "customerId",
                    foreignField: "_id",
                    as: "customerInfo",
                },
            },
            {
                $unwind: {
                    path: "$customerInfo",
                    preserveNullAndEmptyArrays: true,
                },
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

        if (orderDetails.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }

        res.json({
            success: true,
            data: orderDetails[0], // Return the first matched order
            error: false,
        });
    } catch (error) {
        console.error("Error fetching order details:", error); // Log error for debugging
        res.status(500).json({
            success: false,
            data: null,
            error: true,
            message: "Error fetching order details.",
        });
    }
});

orders.put("/:orderId/status", async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate the status input
    const validStatuses = ["pending", "shipped", "delivered", "cancelled"];
    if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            error: true,
            message: "Invalid status. Valid statuses are: " + validStatuses.join(", "),
        });
    }

    try {
        const updatedOrder = await Orders.findOneAndUpdate(
            { orderId: Number(orderId) }, // Convert orderId to a number for the query
            { status }, // Update only the status field
            { new: true } // Return the updated document
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                error: true,
                message: "Order not found.",
            });
        }

        // Generate the email body and HTML content
        let emailHtml;
        switch (status) {
            case "pending":
                emailHtml = `
                    <html>
                        <body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
                            <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                                <div style="background-color: #f8f8f8; padding: 20px; text-align: center;">
                                    <h1 style="color: #333;">Order Update</h1>
                                    <p style="color: #555;">Hi,</p>
                                    <p style="color: #555;">Your order <strong>${orderId}</strong> is currently pending.</p>
                                    <p style="color: #555;">We will process it as soon as possible.</p>
                                </div>
                                <div style="padding: 20px; text-align: center;">
                                    <a href="http://localhost:5173/order/${orderId}" style="text-decoration: none; color: white; background-color: #28a745; padding: 10px 20px; border-radius: 5px;">View Order</a>
                                </div>
                            </div>
                        </body>
                    </html>
                `;
                break;
            case "shipped":
                emailHtml = `
                    <html>
                        <body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
                            <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                                <div style="background-color: #f8f8f8; padding: 20px; text-align: center;">
                                    <h1 style="color: #333;">Order Shipped</h1>
                                    <p style="color: #555;">Hi,</p>
                                    <p style="color: #555;">Your order <strong>${orderId}</strong> has been shipped.</p>
                                    <p style="color: #555;">You can track your package using the provided tracking information.</p>
                                </div>
                                <div style="padding: 20px; text-align: center;">
                                    <a href="http://localhost:5173/order/${orderId}" style="text-decoration: none; color: white; background-color: #007bff; padding: 10px 20px; border-radius: 5px;">Track Order</a>
                                </div>
                            </div>
                        </body>
                    </html>
                `;
                break;
            case "delivered":
                emailHtml = `
                    <html>
                        <body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
                            <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                                <div style="background-color: #f8f8f8; padding: 20px; text-align: center;">
                                    <h1 style="color: #333;">Order Delivered</h1>
                                    <p style="color: #555;">Congratulations!</p>
                                    <p style="color: #555;">Your order <strong>${orderId}</strong> has been delivered successfully.</p>
                                </div>
                                <div style="padding: 20px; text-align: center;">
                                    <a href="http://localhost:5173/order/${orderId}" style="text-decoration: none; color: white; background-color: #28a745; padding: 10px 20px; border-radius: 5px;">View Order</a>
                                </div>
                            </div>
                        </body>
                    </html>
                `;
                break;
            case "cancelled":
                emailHtml = `
                    <html>
                        <body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
                            <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                                <div style="background-color: #f8f8f8; padding: 20px; text-align: center;">
                                    <h1 style="color: #333;">Order Updated</h1>
                                    <p style="color: #555;">Hi,</p>
                                    <p style="color: #555;">Your order <strong>${orderId}</strong> has been updated to <strong>${status.toUpperCase()}</strong> successfully.</p>
                                </div>
                                <div style="padding: 20px; text-align: center;">
                                    <a href="http://localhost:5173/order/${orderId}" style="text-decoration: none; color: white; background-color: #007bff; padding: 10px 20px; border-radius: 5px;">View Order</a>
                                </div>
                            </div>
                        </body>
                    </html>
                `;
                break;
            default:
                emailHtml = `
                    <h1>Order Update</h1>
                    <p>Hi,</p>
                    <p>Your order <strong>${orderId}</strong> has been updated to <strong>${status.toUpperCase()}</strong> successfully.</p>
                `;
                break;
        }

        // Send the email with both text and HTML content
        sendEmail("nachiketgalande1609@gmail.com", "Streamline - Order Update", null, emailHtml);

        res.json({
            success: true,
            data: updatedOrder,
            error: false,
            message: "Order status updated successfully.",
        });
    } catch (error) {
        console.error("Error updating order status:", error); // Log error for debugging
        res.status(500).json({
            success: false,
            error: true,
            message: "Error updating order status.",
        });
    }
});

module.exports = orders;
