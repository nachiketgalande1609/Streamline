const mongoose = require("mongoose");

const Inventory = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        make: { type: String, required: true },
        category: { type: String, required: true },
        on_hand_quantity: { type: Number, required: true },
        cost: { type: Number, required: true },
        price: { type: Number, required: true },
        supplier: { type: String, required: true },
        warehouse: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "warehouses",
            required: true,
        },
        expiryDate: { type: Date },
        status: {
            type: String,
            enum: ["in stock", "out of stock", "discontinued"],
            required: true,
        },
    },
    { collection: "inventory", timestamps: true }
);

const model = mongoose.model("InventoryData", Inventory);

module.exports = model;
