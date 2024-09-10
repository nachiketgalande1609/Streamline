const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
    {
        customer_name: { type: String, required: true },
        contact_number: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        address: { type: String },
        city: { type: String },
        state: { type: String },
        zip_code: { type: String },
        country: { type: String },
        company_name: { type: String },
        customer_type: {
            type: String,
            enum: ["individual", "corporate"],
            default: "individual",
        },
        credit_limit: { type: Number, default: 0 },
        balance_due: { type: Number, default: 0 },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
        notes: { type: String },
    },
    { collection: "customer-data" }
);

const Customer = mongoose.model("CustomerData", CustomerSchema);

module.exports = Customer;
