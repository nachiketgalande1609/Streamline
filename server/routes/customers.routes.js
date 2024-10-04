const express = require("express");
const Customer = require("../models/customers.models");
const mongoose = require("mongoose");

const customerRouter = express.Router();

// Get all customers
customerRouter.get("/", async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const totalCount = await Customer.countDocuments();

        const customers = await Customer.find()
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .exec();

        res.json({
            success: true,
            data: customers,
            totalCount,
            error: false,
        });
    } catch (err) {
        console.error("Error fetching customer data:", err);
        res.status(500).json({
            success: false,
            data: null,
            error: err.message,
        });
    }
});

// Delete a customer by ID
customerRouter.post("/delete", async (req, res) => {
    const { id } = req.body;

    try {
        // Query using _id as a string, since the _id in your document is a string
        const deletedCustomer = await Customer.deleteOne({ _id: id });

        if (deletedCustomer.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Customer deleted successfully",
            data: deletedCustomer,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting customer",
            error: error.message,
        });
    }
});

// Add a new customer
customerRouter.post("/", async (req, res) => {
    try {
        const newCustomer = new Customer(req.body);
        await newCustomer.save();
        res.status(201).json({
            success: true,
            message: "Customer added successfully",
            data: newCustomer,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error adding customer",
            error: error.message,
        });
    }
});

// Update a customer by ID
customerRouter.put("/:id", async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true, // Returns the updated document
                runValidators: true, // Validates the update operation against the schema
            }
        );

        if (!updatedCustomer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Customer updated successfully",
            data: updatedCustomer,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating customer",
            error: error.message,
        });
    }
});

module.exports = customerRouter;
