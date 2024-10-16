const mongoose = require("mongoose");

// Define the schema for an item in an order
const itemSchema = new mongoose.Schema({
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
});

// Define the schema for an order
const orderSchema = new mongoose.Schema(
    {
        orderId: { type: Number, required: true, unique: true },
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        orderDate: { type: Date, required: true },
        shippingDate: { type: Date },
        status: {
            type: String,
            required: true,
            enum: ["pending", "shipped", "delivered", "cancelled"],
        },
        totalAmount: { type: Number, required: true },
        taxAmount: { type: Number, required: true },
        netAmount: { type: Number, required: true },
        paymentMethod: {
            type: String,
            enum: ["credit card", "paypal", "cash on delivery"],
        },
        paymentStatus: { type: String, enum: ["paid", "unpaid", "pending"] },
        paymentDate: { type: Date },
        shippingAddress: { type: String, required: true },
        billingAddress: { type: String, required: true },
        items: [itemSchema],
        createdBy: { type: String, required: true },
        updatedBy: { type: String, required: true },
        notes: { type: String },
    },
    { collection: "orders" }
);

const OrderModel = mongoose.model("Order", orderSchema);

module.exports = OrderModel;
