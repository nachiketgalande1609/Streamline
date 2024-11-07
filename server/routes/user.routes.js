const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");

const user = express.Router();

const uploadsDir = path.join(__dirname, "../uploads");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir); // Save to Streamline/server/uploads
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to filename
    },
});

const upload = multer({ storage: storage });

user.get("/", async (req, res) => {
    const { role, status, page = 1, limit = 10 } = req.query; // Get page and limit from query parameters
    const query = {};

    // Add filters to the query based on role and status
    if (role) {
        query.role = role;
    }

    if (status) {
        query.status = status;
    }

    try {
        // Count total number of users based on filters
        const totalCount = await User.countDocuments(query);

        // Fetch paginated user data based on filters
        const users = await User.find(query)
            .select("-password") // Exclude password field
            .skip((page - 1) * limit) // Skip to the correct page
            .limit(parseInt(limit)) // Limit the number of users fetched
            .exec(); // Execute the query

        res.json({
            success: true,
            data: users,
            totalCount, // Return total count of users based on filters
            error: false,
        });
    } catch (error) {
        console.error("Error fetching user data:", error); // Log error for debugging
        res.status(500).json({
            success: false,
            data: [],
            error: true,
            message: "Error fetching user data.",
        });
    }
});

user.get("/roles", async (req, res) => {
    try {
        const roles = ["admin", "sales", "manager", "user"];
        res.json({
            success: true,
            data: roles,
            error: false,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            data: [],
            error: true,
            message: "Error fetching roles.",
        });
    }
});

user.post("/profile", async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email: email });

    const userData = {
        firstName: user?.first_name,
        lastName: user?.last_name,
        email: user?.email,
        age: user?.age,
        createdAt: user?.created_at,
        phoneNumber: user?.phone_number,
        profilePicture: user?.profile_picture,
        role: user?.role,
        status: user?.status,
    };

    res.json({
        success: true,
        data: userData,
        error: false,
    });
});

user.put("/update", async (req, res) => {
    const { email, firstName, lastName, phoneNumber, profilePicture, role, status, lastLogin } = req.body;

    try {
        const updatedUser = await User.findOneAndUpdate(
            { email: email },
            {
                first_name: firstName,
                last_name: lastName,
                phone_number: phoneNumber,
                profile_picture: profilePicture,
                role: role,
                status: status,
                last_login: lastLogin,
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                error: true,
            });
        }

        const userData = {
            firstName: updatedUser.first_name,
            lastName: updatedUser.last_name,
            email: updatedUser.email,
            phoneNumber: updatedUser.phone_number,
            profilePicture: updatedUser.profile_picture,
            role: updatedUser.role,
            status: updatedUser.status,
            lastLogin: updatedUser.last_login,
        };

        res.json({
            success: true,
            data: userData,
            error: false,
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: true,
        });
    }
});

user.post("/uploadProfilePicture", upload.single("profilePicture"), async (req, res) => {
    const { user_id } = req.headers;

    const userObjectId = new mongoose.Types.ObjectId(user_id);

    if (!userObjectId || !req.file) {
        return res.status(400).json({
            success: false,
            message: "Email and profile picture are required",
            error: true,
        });
    }

    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: userObjectId },
            { profile_picture: `/uploads/${req.file.filename}` },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                error: true,
            });
        }

        res.json({
            success: true,
            data: { profilePicture: updatedUser.profile_picture },
            error: false,
        });
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        res.status(500).json({
            success: false,
            message: "Error uploading profile picture",
            error: true,
        });
    }
});

module.exports = user;
