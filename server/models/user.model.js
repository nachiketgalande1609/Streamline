const mongoose = require("mongoose");

const User = new mongoose.Schema(
    {
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone_number: { type: String },
        profile_picture: { type: String },
        age: { type: Number },
        role: {
            type: String,
            enum: ["admin", "sales", "manager", "user"],
        },
        status: {
            type: String,
            enum: ["active", "inactive", "suspended"],
            default: "active",
        },
        last_login: { type: Date },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
    },
    { collection: "user-data" }
);

const model = mongoose.model("UserData", User);

module.exports = model;
