const mongoose = require("mongoose");

// Define the schema for an item in an order
const itemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    discount: { type: Number, default: 0 }, // Discount on individual item
    totalPrice: { type: Number, required: true },
    taxRate: { type: Number, default: 0 }, // Tax rate applicable to the item
});

// Define the schema for an order
const orderSchema = new mongoose.Schema(
    {
        orderId: { type: Number, required: true, unique: true },
        customerId: {
            type: String,
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
        taxAmount: { type: Number, default: 0 }, // Total tax amount for the order
        discount: { type: Number, default: 0 }, // Total discount applied
        netAmount: { type: Number, required: true }, // Total amount after discount and tax
        paymentMethod: {
            type: String,
            enum: ["credit card", "bank transfer", "cash on delivery"],
        },
        paymentStatus: { type: String, enum: ["paid", "unpaid", "pending"] },
        paymentDate: { type: Date },
        shippingAddress: { type: String, required: true },
        billingAddress: { type: String, required: true },
        items: [itemSchema],
        createdBy: { type: String, required: true }, // User who created the order
        updatedBy: { type: String, required: true }, // User who last updated the order
        notes: { type: String }, // Additional notes or instructions
    },
    { collection: "orders" }
);

const OrderModel = mongoose.model("Order", orderSchema);

module.exports = OrderModel;
