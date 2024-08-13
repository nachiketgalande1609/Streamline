const mongoose = require("mongoose");

const Warehouse = new mongoose.Schema(
    {
        warehouse_id: { type: String, required: true },
        name: { type: String, required: true },
        location: { type: String, required: true },
        capacity: { type: Number, required: true },
        current_stock: { type: Number, required: true },
    },
    { collection: "warehouse" }
);

const model = mongoose.model("WarehouseData", Warehouse);

module.exports = model;
