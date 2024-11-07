const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Tenants = require("../models/tenants.models");

const auth = express.Router();

auth.post("/register", async (req, res) => {
    try {
        const hashed_pwd = await bcrypt.hash(req.body.password, 10);
        await User.create({
            tenant: req.body.tenant,
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            email: req.body.email,
            password: hashed_pwd,
            created_at: new Date(),
            role: "user",
            status: "active",
        });
        res.json({
            success: true,
            data: "User Created Successfully",
            error: false,
        });
    } catch (error) {
        res.json({
            success: false,
            data: "User Already Exists",
            error: true,
        });
    }
});

auth.post("/login", async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
    });

    if (!user) {
        res.json({
            success: false,
            data: "User not Found",
            error: true,
            user: false,
        });
    }

    if (req.body.tenant !== user.tenant.toString()) {
        res.json({
            success: false,
            data: "Invalid Tenant Name",
            error: true,
            user: null,
            token: false,
        });
    }

    const is_password_valid = await bcrypt.compare(req.body.password, user?.password);

    user.last_login = new Date();
    await user.save();

    if (is_password_valid) {
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
            },
            "secret123"
        );

        res.json({
            success: true,
            data: "Logged In Successfully",
            error: false,
            user: {
                user_id: user._id,
                user_email: user.email,
                user_first_name: user.first_name,
                user_last_name: user.last_name,
                user_profile: user.profile_picture,
                user_tenant: user.tenant,
            },
            token: token,
        });
    } else {
        res.json({
            success: false,
            data: "Please check your username/password",
            error: true,
            user: null,
            token: false,
        });
    }
});

auth.post("/logout", (req, res) => {
    res.json({
        success: true,
        data: "Logged Out Successfully",
        error: false,
        user: false,
    });
});

auth.get("/verify-token", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ success: false, data: "Token not provided", error: true });
    }

    try {
        const decoded = jwt.verify(token, "secret123");
        res.json({ success: true, data: decoded, error: false });
    } catch (error) {
        res.status(401).json({ success: false, data: "Invalid token", error: true });
    }
});

auth.get("/tenants", async (req, res) => {
    const tenants = await Tenants.find().select("name");
    res.json({ data: tenants });
});

module.exports = auth;
