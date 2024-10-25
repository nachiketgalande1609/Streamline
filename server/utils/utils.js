const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.HOST_EMAIL,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async (to, subject, body, html = null) => {
    const mailOptions = {
        from: process.env.HOST_EMAIL,
        to: to,
        subject: subject,
        text: body,
        ...(html && { html }),
    };

    try {
        await transporter.sendMail(mailOptions);
        return {
            success: true,
            message: "Email sent successfully",
            error: false,
        };
    } catch (error) {
        console.error("Error sending email:", error);
        return {
            success: false,
            message: "Failed to send email",
            error: true,
        };
    }
};

module.exports = { sendEmail };
