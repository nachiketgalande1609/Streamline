const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");

const user = express.Router();

user.get("/", async (req, res) => {
    const { role, status } = req.query;
    const query = {};

    if (role) {
        query.role = role;
    }

    if (status) {
        query.status = status;
    }

    try {
        const data = await User.find(query).select("-password");
        res.json({
            success: true,
            data: data,
            error: false,
        });
    } catch (error) {
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
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        age: user.age,
        createdAt: user.created_at,
        phoneNumber: user.phone_number,
        profilePicture: user.profile_picture,
        role: user.role,
        status: user.status,
    };

    res.json({
        success: true,
        data: userData,
        error: false,
    });
});

user.put("/update", async (req, res) => {
    const {
        email,
        firstName,
        lastName,
        phoneNumber,
        profilePicture,
        role,
        status,
        lastLogin,
    } = req.body;

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

module.exports = user;
