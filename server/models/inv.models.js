const mongoose = require("mongoose");

const Inventory = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: String, required: true },
        quantity: { type: Number, required: true },
        cost: { type: Number, required: true },
        price: { type: Number, required: true },
        min_stock_level: { type: Number, required: true },
        reorder_point: { type: Number, required: true },
        supplier: { type: String, required: true },
        warehouse: { type: String, required: true },
        dateAdded: { type: Date, required: true },
        expiryDate: { type: Date },
        status: {
            type: String,
            enum: ["in stock", "out of stock", "discontinued"],
            required: true,
        },
    },
    { collection: "inventory" }
);

const model = mongoose.model("InventoryData", Inventory);

module.exports = model;
