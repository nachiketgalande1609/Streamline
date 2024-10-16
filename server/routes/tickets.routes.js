const express = require("express");
const multer = require("multer");
const TicketModel = require("../models/tickets.models");
const tickets = express.Router();
const mongoose = require("mongoose");

const upload = multer();

tickets.post("/", upload.none(), async (req, res) => {
    const {
        userId,
        name,
        issueType,
        department,
        subject,
        description,
        email,
        phone,
        priority,
        attachments,
    } = req.body;

    try {
        const generateUniqueTicketId = async () => {
            let uniqueId;
            let isUnique = false;

            while (!isUnique) {
                uniqueId = Math.floor(100000 + Math.random() * 900000);
                const existingOrder = await TicketModel.findOne({
                    orderId: uniqueId,
                });
                isUnique = !existingOrder;
            }

            return uniqueId;
        };

        // Generate a unique orderId
        const ticketId = await generateUniqueTicketId();

        const newTicket = new TicketModel({
            userId,
            ticketId,
            name,
            issueType,
            department,
            subject,
            description,
            email,
            phone,
            priority,
            attachments,
        });

        await newTicket.save();
        res.status(201).json({
            success: true,
            message: "Ticket created successfully",
            data: newTicket,
        });
    } catch (error) {
        console.error("Error creating ticket:", error);
        res.status(500).json({
            success: false,
            message: "Error creating ticket.",
            error: true,
        });
    }
});

tickets.get("/", async (req, res) => {
    try {
        const statuses = ["open", "in progress", "resolved", "closed"];
        const totalCount = await TicketModel.countDocuments();
        const data = await TicketModel.find();
        res.json({
            success: true,
            data: data,
            totalCount,
            error: false,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            data: [],
            error: true,
            message: "Error fetching incidents.",
        });
    }
});

// Endpoint to fetch a ticket by ID
tickets.get("/:ticketId", async (req, res) => {
    const { ticketId } = req.params;
    try {
        const ticket = await TicketModel.findOne({ ticketId });
        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found",
            });
        }
        res.json({
            success: true,
            data: ticket,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching ticket.",
            error: true,
        });
    }
});

tickets.put("/:id", async (req, res) => {
    const id = req.body._id;

    console.log(req.body);

    console.log(id);

    const updateData = req.body;

    const ticketObjectId = new mongoose.Types.ObjectId(id);

    try {
        const updatedTicket = await TicketModel.findByIdAndUpdate(
            ticketObjectId,
            {
                ...updateData,
                updatedDate: new Date(),
            },
            { new: true, runValidators: true }
        );

        if (!updatedTicket) {
            return res
                .status(404)
                .json({ success: false, message: "Ticket not found" });
        }

        return res.status(200).json({ success: true, data: updatedTicket });
    } catch (error) {
        console.error("Error updating ticket:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
    }
});

module.exports = tickets;
