const mongoose = require("mongoose");
const UserModel = require("../models/user.model");

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
            enum: ["Bug", "Billing", "Feature Request", "UI Issues", "Performance", "Other"],
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
            enum: ["low", "medium", "high", "critical"],
        },
        status: {
            type: String,
            required: true,
            enum: ["open", "in progress", "resolved", "closed"],
            default: "open",
        },
        assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: UserModel },
        history: [
            {
                action: { type: String, required: true },
                changes: [
                    {
                        field: { type: String, required: true },
                        oldValue: { type: mongoose.Schema.Types.Mixed },
                        newValue: { type: mongoose.Schema.Types.Mixed },
                    },
                ],
                updatedByOid: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                updatedByEmail: { type: String, required: true },
                updatedByName: { type: String, required: true },
                timestamp: { type: Date, default: Date.now },
            },
        ],
    },
    { collection: "tickets", timestamps: true }
);

const TicketModel = mongoose.model("Ticket", ticketSchema);

module.exports = TicketModel;
