const mongoose = require("mongoose");

const Sales = new mongoose.Schema(
    {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        age: { type: Number },
        created_at: { type: Date, default: Date.now },
    },
    { collection: "sales-data" }
);

const model = mongoose.model("SalesData", Sales);

module.exports = model;
