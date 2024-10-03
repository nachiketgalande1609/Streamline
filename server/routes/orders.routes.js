const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Orders = require("../models/orders.models");
const Customer = require("../models/customers.models");
const Inventory = require("../models/inv.models");

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
        $unwind: {
          path: "$customerInfo",
          preserveNullAndEmptyArrays: true, // Include orders even without customer info
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
        const existingOrder = await Orders.findOne({ orderId: uniqueId });
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
      { _id: 1, customer_name: 1, email: 1, contact_number: 1, address: 1 }
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

module.exports = orders;
