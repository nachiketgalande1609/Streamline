const mongoose = require("mongoose");

const Inventory = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        supplier: { type: String, required: true },
        warehouse: { type: String, required: true },
        dateAdded: { type: Date, required: true },
        expiryDate: { type: Date, required: true },
    },
    { collection: "inventory" }
);

const model = mongoose.model("InventoryData", Inventory);

module.exports = model;
