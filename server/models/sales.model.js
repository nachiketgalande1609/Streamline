const mongoose = require("mongoose");

const SalesSchema = new mongoose.Schema(
    {
        orderNumber: { type: String, required: true, unique: true },
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                productName: { type: String, required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
                total: { type: Number, required: true }, // quantity * price
            },
        ],
        totalAmount: { type: Number, required: true }, // Sum of all item totals
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "Pending",
        },
        orderStatus: {
            type: String,
            enum: ["pending", "shipped", "delivered", "cancelled"],
            default: "Processing",
        },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { collection: "sales-data" }
);

const SalesModel = mongoose.model("SalesData", SalesSchema);

module.exports = SalesModel;
