const mongoose = require("mongoose");

// Define the schema for an item in an order
const itemSchema = new mongoose.Schema({
    productId: { type: Number, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
});

// Define the schema for an order
const orderSchema = new mongoose.Schema(
    {
        orderId: { type: Number, required: true, unique: true },
        customerId: { type: Number, required: true },
        orderDate: { type: Date, required: true },
        shippingDate: { type: Date },
        status: { type: String, required: true },
        totalAmount: { type: Number, required: true },
        items: [itemSchema],
        shippingAddress: { type: String, required: true },
        billingAddress: { type: String, required: true },
    },
    { collection: "orders" }
);

const OrderModel = mongoose.model("Order", orderSchema);

module.exports = OrderModel;
