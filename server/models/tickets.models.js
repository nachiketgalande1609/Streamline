const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
    {
        ticketId: { type: Number, required: true, unique: true },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user-data",
        },
        issueType: {
            type: String,
            required: true,
            enum: [
                "Bug",
                "Billing",
                "Feature Request",
                "UI Issues",
                "Performance",
                "Other",
            ],
        },
        department: {
            type: String,
            required: true,
            enum: ["Support", "Sales", "Billing", "Technical", "Other"],
        },
        subject: { type: String, required: true },
        description: { type: String, required: true },
        priority: {
            type: String,
            required: true,
            enum: ["low", "medium", "high", "urgent"],
        },
        status: {
            type: String,
            required: true,
            enum: ["open", "in progress", "resolved", "closed"],
            default: "open",
        },
        createdDate: { type: Date, default: Date.now },
        updatedDate: { type: Date },
        assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        attachments: [{ type: String }],
    },
    { collection: "tickets" }
);

const TicketModel = mongoose.model("Ticket", ticketSchema);

module.exports = TicketModel;
