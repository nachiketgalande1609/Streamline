const express = require("express");
const nodemailer = require("nodemailer");

const utils = express.Router();

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "nachiket4251@gmail.com",
        pass: "sfzh zljq nioq qcgt", // your email password
    },
});

// Define the email options
const mailOptions = {
    from: "nachiket4251@gmail.com",
    to: "nachiketgalande1609@gmail.com", // recipient address
    subject: "Hello from MERN app",
    text: "This is the content of the email",
    // html: '<b>This is the HTML content</b>' // Optionally, use HTML content
};

utils.post("/email", async (req, res) => {
    const { subject, body } = req.body;

    const mailOptions = {
        from: "nachiket4251@gmail.com",
        to: "nachiketgalande1609@gmail.com",
        subject: subject,
        text: body,
    };

    try {
        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: "Email sent successfully",
            error: false,
        });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send email",
            error: true,
        });
    }
});

module.exports = utils;
