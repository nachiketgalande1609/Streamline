const mongoose = require("mongoose");

// Define the Warehouse schema
const WarehouseSchema = new mongoose.Schema(
    {
        warehouse_id: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        location: { type: String, required: true },
        capacity: { type: Number, required: true },
        current_stock: { type: Number, default: 0 },
        manager_id: {
            type: String,
            required: true,
        },
        contact_number: { type: String },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
    },
    { collection: "warehouses" }
);

const WarehouseModel = mongoose.model("Warehouse", WarehouseSchema);

module.exports = WarehouseModel;
