const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Inventory = require("../models/inv.models");

const inv = express.Router();

inv.get("/", async (req, res) => {
    const data = await Inventory.find();
    res.json({
        success: true,
        data: data,
        error: false,
    });
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

module.exports = inv;
