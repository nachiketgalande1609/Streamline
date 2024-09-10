const express = require("express");
const Customer = require("../models/customers.models");

const customerRouter = express.Router();

customerRouter.get("/", async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json({
            success: true,
            data: customers,
            error: false,
        });
    } catch (err) {
        res.json({
            success: false,
            data: null,
            error: err.message,
        });
    }
});

module.exports = customerRouter;
