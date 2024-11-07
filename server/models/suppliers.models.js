const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
    {
        supplier_id: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: /.+\@.+\..+/,
        },
        phone: {
            type: String,
            required: true,
            match: /^\+?[0-9]{1,15}$/,
        },
    },
    { collection: "suppliers", timestamps: true }
);

const Supplier = mongoose.model("Supplier", supplierSchema);

module.exports = Supplier;
