const express = require("express");
const multer = require("multer");
const TicketModel = require("../models/tickets.models");
const tickets = express.Router();
const mongoose = require("mongoose");
const UserModel = require("../models/user.model");

const { sendEmail } = require("../utils/utils");

const upload = multer();

tickets.post("/", upload.none(), async (req, res) => {
    const { userId, issueType, department, subject, description, priority } = req.body;

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
            issueType,
            department,
            subject,
            description,
            priority,
            assignedTo: null,
        });

        await newTicket.save();

        // Define the email HTML content
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <img src="https://www.rossvideo.com/wp-content/uploads/2018/04/Streamline-Cloud.jpg" alt="Company Logo" style="max-width: 150px;" />
                </div>
                <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px;">
                    <h2 style="color: #555;">Thank You for Reaching Out!</h2>
                    <p style="font-size: 16px; color: #777;">Your ticket has been successfully created. We are here to assist you and will respond to your request as soon as possible.</p>
                </div>

                <div style="margin-top: 20px;">
                    <h3 style="color: #333;">Ticket Details:</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Ticket ID:</strong></td>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${ticketId}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Subject:</strong></td>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${subject}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Description:</strong></td>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${description}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Priority:</strong></td>
                            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${priority}</td>
                        </tr>
                    </table>
                </div>

                <div style="margin-top: 20px; text-align: center;">
                    <a href="http://localhost:5173/incidents/${ticketId}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Ticket</a>
                </div>

                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #999;">
                    <p style="font-size: 14px;">If you have any questions, feel free to <a href="mailto:support@streamline.com" style="color: #007bff;">contact our support team</a>.</p>
                    <p style="font-size: 12px;">&copy; 2024 Streamline. All rights reserved.</p>
                </div>
            </div>
        `;

        // Send the email with a more descriptive subject
        sendEmail("nachiketgalande1609@gmail.com", `Streamline - New Ticket Created`, null, emailHtml);

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

tickets.get("/assignees", async (req, res) => {
    const { search } = req.query;

    try {
        const query = search ? { email: { $regex: search, $options: "i" } } : {};
        const assignees = await UserModel.find(query).select("_id email");

        res.json({
            success: true,
            assignees,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching assignees.",
            error: true,
        });
    }
});

// Endpoint to fetch a ticket by ID
tickets.get("/:ticketId", async (req, res) => {
    const { ticketId } = req.params;
    try {
        const ticket = await TicketModel.findOne({ ticketId }).populate("assignedTo", "email");
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
    const user_id = req.headers.user_id;
    const user_email = req.headers.user_email;
    const user_name = req.headers.user_name;
    const { id } = req.params;
    const updateData = req.body;
    const ticketObjectId = new mongoose.Types.ObjectId(id);

    try {
        // Fetch the existing ticket
        const ticket = await TicketModel.findById(ticketObjectId);
        if (!ticket) {
            return res.status(404).json({ success: false, message: "Ticket not found" });
        }

        // Function to generate structured update data
        const generateUpdateChanges = (oldData, newData) => {
            const changes = [];
            for (const key in newData) {
                if (newData[key] !== oldData[key]) {
                    changes.push({
                        field: key,
                        oldValue: oldData[key] || null,
                        newValue: newData[key],
                    });
                }
            }
            return changes.length ? changes : null;
        };

        // Generate the update changes
        const changes = generateUpdateChanges(ticket.toObject(), updateData);

        if (!changes) {
            return res.status(400).json({ success: false, message: "No changes made." });
        }

        // Update the ticket and push to history
        ticket.set({
            ...updateData,
            updatedDate: new Date(),
        });
        ticket.history.push({
            action: "Updated ticket",
            changes: changes, // Store structured changes
            updatedByOid: user_id,
            updatedByEmail: user_email,
            updatedByName: user_name,
            timestamp: new Date(),
        });

        await ticket.save();

        return res.status(200).json({ success: true, data: ticket });
    } catch (error) {
        console.error("Error updating ticket:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

module.exports = tickets;
